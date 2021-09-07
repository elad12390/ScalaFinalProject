package controllers

import akka.actor.ActorSystem
import entitites.AccountOperation
import models.exceptions.ApiResponseException
import models.requests.{AuthRequest, GetAccountOperationsFilterRequest}
import play.api.libs.json.JsValue
import play.api.mvc.{Action, AnyContent, ControllerComponents, Request, Result}
import services.{AccountService, UserService}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}


class AuthController @Inject()(
                                cc: ControllerComponents,
                                authService: UserService,
                                actorSystem: ActorSystem)(implicit exec: ExecutionContext) extends MyBaseController(cc, actorSystem) {

  def register: Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request =>
    request.body.validate[AuthRequest].fold(
      _ => Future.successful(BadRequest("Cannot parse request body")),
      registerRequest => {
        authService.register(registerRequest).transformWith[Result] {
          case Success(res) => okResponse(res).map(r => r.addingToSession("token" -> res.token, "user" -> res.userName))
          case Failure(exception) => exception match {
            case e: ApiResponseException => handleApiResponseException(e)
            case e => Future {InternalServerError("Internal server error: " + e.toString)}
          }
        }
      }
    )
  }

  def login: Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request =>
    request.body.validate[AuthRequest].fold(
      _ => Future.successful(BadRequest("Cannot parse request body")),
      registerRequest => authService.login(registerRequest).transformWith[Result] {
        case Success(res) => okResponse(res).map(r => r.addingToSession("token" -> res.token, "user" -> res.userName))
        case Failure(exception) => exception match {
          case e: ApiResponseException => handleApiResponseException(e)
          case e => Future {InternalServerError("Internal server error: " + e.toString)}
        }

      }
    )
  }
}
