package filters

import akka.stream.Materializer
import play.api.mvc.{Filter, RequestHeader, Result}
import reactivemongo.bson.BSONObjectID
import services.UserService

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class UserIdFilter @Inject()(implicit val mat: Materializer, ec: ExecutionContext, userService: UserService) extends Filter {
  override def apply(f: RequestHeader => Future[Result])(rh: RequestHeader): Future[Result] = {
    val username = rh.headers.get("user")
    var newHeader: Option[(String, String)] = None
    if (username.nonEmpty) {
      val userId = getUserId(username.get)
      userId.flatMap(id => {
        if (id.nonEmpty) {
          newHeader = Some("userId" -> id.get.stringify)
          f(rh.withHeaders(rh.headers.add(newHeader.get)))
        } else {
          f(rh)
        }
      })
    } else {
      f(rh)
    }
  }

  def getUserId(username: String): Future[Option[BSONObjectID]] = {
    userService.getUserId(username)
  }
}
