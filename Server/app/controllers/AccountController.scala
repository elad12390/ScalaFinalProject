package controllers

import akka.actor.ActorSystem
import entitites.AccountOperation
import models.exceptions.ApiResponseException
import models.requests.GetAccountOperationsFilterRequest
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{Action, AnyContent, ControllerComponents, Request, Result}
import services.AccountService

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}


class AccountController @Inject()(
                                   cc: ControllerComponents,
                                   authService: AccountService,
                                   actorSystem: ActorSystem)(implicit exec: ExecutionContext) extends MyBaseController(cc, actorSystem) {

  def getAll: Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request => {
    request.body.validate[GetAccountOperationsFilterRequest].fold(
      _ => Future.successful(BadRequest("cannot parse filter request")),
      filter => authService.getAll(filter).transformWith[Result]{
        case Success(res) => okResponse(res)
        case Failure(exception) => exception match {
          case e: ApiResponseException => handleApiResponseException(e)
          case e => Future {InternalServerError("Internal server error: " + e.toString)}
        }
      }
    )
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
    request.body.validate[AccountOperation].fold(
      _ => Future.successful(BadRequest("Cannot parse request body")),
      op => authService.create(op).transformWith[Result]{
        case Success(res) => createdResponse(res)
        case Failure(exception) => exception match {
          case e: ApiResponseException => handleApiResponseException(e)
          case e => Future {InternalServerError("Internal server error: " + e.toString)}
        }
      }
    )
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
