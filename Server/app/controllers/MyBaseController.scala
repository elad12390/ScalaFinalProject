package controllers

import akka.actor.ActorSystem
import com.google.gson.Gson
import models.ApiResponse
import play.api.http.MimeTypes
import play.api.mvc.{AbstractController, ControllerComponents, Result}
import utils.Serializers.gson



class MyBaseController(
                        cc: ControllerComponents,
                        actorSystem: ActorSystem) extends AbstractController(cc) {

  def okResponse[T <: Any](res: T): Result = {
    try {
      val json = gson.toJson(ApiResponse(data = Some(res), httpCode = Some(OK)))
      Ok(json).as(MimeTypes.JSON)
    } catch {
      case exception: Exception => InternalServerError("Internal server error: " + exception)
    }
  }
  def createdResponse[T <: Any](res: Any): Result = {
    try {
      Created(gson.toJson(ApiResponse(data = Some(res), httpCode = Some(OK))))
    } catch {
      case exception: Exception => InternalServerError("Internal server error: " + exception)
    }
  }
}
