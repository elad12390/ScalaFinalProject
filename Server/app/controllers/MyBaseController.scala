package controllers

import akka.actor.ActorSystem
import com.google.gson.Gson
import models.exceptions.ApiResponseException
import models.responses.ApiResponse
import play.api.http.MimeTypes
import play.api.mvc.{AbstractController, ControllerComponents, Result}
import utils.Serializers.gson

import scala.concurrent.{ExecutionContext, Future}



class MyBaseController(
                        cc: ControllerComponents,
                        actorSystem: ActorSystem)(implicit exec: ExecutionContext) extends AbstractController(cc) {

  def handleApiResponseException(exception: ApiResponseException): Future[Result] = {
      val response = ApiResponse(
        errorCode = Some(exception.err.id),
        errorMessage = Some(exception.err.toString),
        httpCode = Some(OK)
      )
      Future { Ok(gson.toJson(response)).as(MimeTypes.JSON) }
  }

  def okResponse[T <: Any](res: T): Future[Result] = {
    try {
      val response = ApiResponse(
        data = Some(res),
        httpCode = Some(OK)
      )
      Future {Ok(gson.toJson(response)).as(MimeTypes.JSON)}
    } catch {
      case exception: Exception => Future {InternalServerError("Internal server error: " + exception)}
    }
  }

  def createdResponse[T <: Any](res: Any): Future[Result] = {
    try {
      val response = ApiResponse(
        data = Some(res),
        httpCode = Some(OK)
      )
      Future { Created(gson.toJson(response)) }
    } catch {
      case exception: Exception => Future{InternalServerError("Internal server error: " + exception)}
    }
  }
}
