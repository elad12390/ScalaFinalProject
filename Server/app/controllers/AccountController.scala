package controllers

import akka.actor.ActorSystem
import entitites.AccountOperation
import enums.InnerErrorCodes
import models.exceptions.ApiResponseException
import models.requests.GetAccountOperationsFilterRequest
import models.requests.GetAccountOperationsFilterRequest.map2GetAccountOperationsFilterRequest
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{Action, AnyContent, ControllerComponents, Request, Result}
import reactivemongo.bson.BSONObjectID
import services.AccountService

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}


class AccountController @Inject()(
                                   cc: ControllerComponents,
                                   authService: AccountService,
                                   actorSystem: ActorSystem)(implicit exec: ExecutionContext) extends MyBaseController(cc, actorSystem) {

  def getAll: Action[AnyContent] = Action.async { implicit request => {
    var filter = request.queryString.map{ case (k,v) => k -> v.toString }
    if (request.headers.get("userId").nonEmpty) {
      filter += ("userId" -> request.headers.get("userId").get)
    }
    authService.getAll(map2GetAccountOperationsFilterRequest(filter)).transformWith[Result]{
        case Success(res) => okResponse[Seq[AccountOperation]](res)
        case Failure(exception) => exception match {
          case e: ApiResponseException => handleApiResponseException(e)
          case e => Future {InternalServerError("Internal server error: " + e.toString)}
        }
      }
  }}

  def getById(id: String): Action[AnyContent] = Action.async { implicit request: Request[Any] =>
    authService.getById(id).transformWith[Result] {
      case Success(res) => okResponse(res)
      case Failure(exception) => exception match {
        case e: ApiResponseException => handleApiResponseException(e)
        case e => Future {InternalServerError("Internal server error: " + e.toString)}
      }
    }
  }

  def create(): Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request => {
    if (request.headers.get("userId").nonEmpty) {
      val createdByTry = BSONObjectID.parse(request.headers.get("userId").get)
      if (createdByTry.isSuccess) {
        request.body.validate[AccountOperation].fold(
          _ => Future.successful(BadRequest("Cannot parse request body")),
          op => authService.create(op.copy(_createBy = createdByTry.toOption)).transformWith[Result] {
            case Success(res) => createdResponse(res)
            case Failure(exception) => exception match {
              case e: ApiResponseException => handleApiResponseException(e)
              case e => Future {
                InternalServerError("Internal server error: " + e.toString)
              }
            }
          }
        )

      } else {
        handleApiResponseException(ApiResponseException(InnerErrorCodes.NotLoggedIn))
      }
    } else {
      handleApiResponseException(ApiResponseException(InnerErrorCodes.NotLoggedIn))
    }
  }}

  def update(id: String): Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request => {
    request.body.validate[AccountOperation].fold(
      _ => Future.successful(BadRequest("Cannot parse request body")),
      op => authService.update(id, op).transformWith[Result]{
        case Success(res) => okResponse(res)
        case Failure(exception) => exception match {
          case e: ApiResponseException => handleApiResponseException(e)
          case e => Future {InternalServerError("Internal server error: " + e.toString)}
        }
      },
    )
  }}

  def delete(id: String): Action[AnyContent] = Action.async { implicit request: Request[Any] =>
    authService.delete(id).transformWith[Result]{
      case Success(res) => okResponse(res)
      case Failure(exception) => exception match {
        case e: ApiResponseException => handleApiResponseException(e)
        case e => Future {InternalServerError("Internal server error: " + e.toString)}
      }
    }
  }
}
