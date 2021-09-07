package filters

import akka.stream.Materializer
import play.api.mvc.{EssentialAction, Filter, RequestHeader, Result}
import services.UserService

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class AuthFilter @Inject() (implicit val mat: Materializer, ec: ExecutionContext, userService: UserService) extends Filter {

  override def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    if (requestHeader.path.startsWith("/api/auth")) {
      return nextFilter(requestHeader)
    }
    requestHeader.session.get("user").map { userName =>
      requestHeader.session.get("token").map(token => {
        userService.isLoggedIn(userName, token)
        nextFilter(requestHeader)
      }).getOrElse {
        throw new Exception("not logged in")
      }
    }.getOrElse {
      throw new Exception("not logged in")
    }
  }
}