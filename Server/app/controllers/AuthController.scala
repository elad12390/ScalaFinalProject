package controllers

import akka.actor.ActorSystem
import entitites.AccountOperation
import models.requests.{GetAccountOperationsFilterRequest, AuthRequest}
import play.api.libs.json.JsValue
import play.api.mvc.{Action, AnyContent, ControllerComponents, Request}
import services.{AccountService, UserService}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}


class AuthController @Inject()(
                                cc: ControllerComponents,
                                authService: UserService,
                                actorSystem: ActorSystem)(implicit exec: ExecutionContext) extends MyBaseController(cc, actorSystem) {

  def register: Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request =>
    request.body.validate[AuthRequest].fold(
      _ => Future.successful(BadRequest("Cannot parse request body")),
      registerRequest => authService.register(registerRequest).map {
        res => okResponse(res).addingToSession("token" -> res.token, "user" -> res.userName)
      }
    )
  }

  def login: Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request =>
    request.body.validate[AuthRequest].fold(
      _ => Future.successful(BadRequest("Cannot parse request body")),
      registerRequest => authService.login(registerRequest).map {
        res => okResponse(res).addingToSession("token" -> res.token, "user" -> res.userName)
      }
    )
  }
}
