package filters

import akka.stream.Materializer
import enums.InnerErrorCodes
import enums.InnerErrorCodes.InnerErrorCodes
import models.exceptions.ApiResponseException
import models.responses.ApiResponse
import play.api.http.MimeTypes
import play.api.http.Status.OK
import play.api.mvc.Results.Ok
import play.api.mvc.{EssentialAction, Filter, RequestHeader, Result}
import services.UserService
import utils.Serializers.gson

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class AuthFilter @Inject() (implicit val mat: Materializer, ec: ExecutionContext, userService: UserService) extends Filter {

  override def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    if (requestHeader.path.startsWith("/api/auth")) {
      return nextFilter(requestHeader)
    }
    requestHeader.headers.get("user").map { userName =>
      requestHeader.headers.get("token").map(token => {
        userService.isLoggedIn(userName, token).transformWith[Result] {
          case Success(isLoggedIn) => if (isLoggedIn) {nextFilter(requestHeader)} else {returnInnerErrorCode(nextFilter)(requestHeader)(ApiResponseException(InnerErrorCodes.NotLoggedIn))}
        }
      }).getOrElse {
        return returnInnerErrorCode(nextFilter)(requestHeader)(ApiResponseException(InnerErrorCodes.NotLoggedIn))
      }
    }.getOrElse {
      return returnInnerErrorCode(nextFilter)(requestHeader)(ApiResponseException(InnerErrorCodes.NotLoggedIn))
    }
  }

  def returnInnerErrorCode(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader)(exception: ApiResponseException): Future[Result] = {
    nextFilter(requestHeader).map(_ => {
      val response = ApiResponse(
        errorCode = Some(exception.err.id),
        errorMessage = Some(exception.err.toString),
        httpCode = Some(OK)
      )
      Ok(gson.toJson(response))
        .as(MimeTypes.JSON)
    })

  }
}