package controllers

import akka.actor.ActorSystem
import entitites.AccountOperation
import models.requests.GetAccountOperationsFilterRequest
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{Action, AnyContent, ControllerComponents, Request}
import services.AccountService

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}


class AccountController @Inject()(
                                   cc: ControllerComponents,
                                   authService: AccountService,
                                   actorSystem: ActorSystem)(implicit exec: ExecutionContext) extends MyBaseController(cc, actorSystem) {

  def getAll: Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request => {
    request.body.validate[GetAccountOperationsFilterRequest].fold(
      _ => Future.successful(BadRequest("cannot parse filter request")),
      filter => authService.getAll(filter).map{okResponse}
    )
  }}

  def getById(id: String): Action[AnyContent] = Action.async { implicit request: Request[Any] =>
    authService.getById(id).map { okResponse }
  }

  def create(): Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request => {
    request.body.validate[AccountOperation].fold(
      _ => Future.successful(BadRequest("Cannot parse request body")),
      op => authService.create(op).map { createdResponse },
    )
  }}

  def update(id: String): Action[JsValue] = Action.async(controllerComponents.parsers.json) { implicit request => {
    request.body.validate[AccountOperation].fold(
      _ => Future.successful(BadRequest("Cannot parse request body")),
      op => authService.update(id, op).map { okResponse },
    )
  }}

  def delete(id: String): Action[AnyContent] = Action.async { implicit request: Request[Any] =>
    authService.delete(id).map { okResponse }
  }
}
