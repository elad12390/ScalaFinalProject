package entitites
import org.joda.time.DateTime
import play.api.libs.json.{Format, Json}
import reactivemongo.play.json._
import reactivemongo.bson.BSONObjectID
import reactivemongo.bson._
import play.api.libs.json.JodaWrites._
import play.api.libs.json.JodaReads._

case class User(
                  _id:Option[BSONObjectID] = None,
                  _createdAt: Option[DateTime] = None,
                  _updatedAt: Option[DateTime] = None,
                  userName: Option[String] = None,
                  passwordHash: Option[String] = None,
                  token: Option[String] = None,
                  tokenExpiration: Option[DateTime] = None
                )


object User {
  implicit val fmt : Format[User] = Json.format[User]

  implicit object UserBSONReader extends BSONDocumentReader[User] {
    def read(doc: BSONDocument): User = {
      User(
        doc.getAs[BSONObjectID]("_id"),
        doc.getAs[BSONDateTime]("_createdAt").map(dt => new DateTime(dt.value)),
        doc.getAs[BSONDateTime]("_updatedAt").map(dt => new DateTime(dt.value)),
        doc.getAs[String]("userName"),
        doc.getAs[String]("passwordHash"),
        doc.getAs[String]("token"),
        doc.getAs[BSONDateTime]("tokenExpiration").map(dt => new DateTime(dt.value))
      )
    }
  }

  implicit object UserBSONWriter extends BSONDocumentWriter[User] {
    def write(user: User): BSONDocument = {
      BSONDocument(
        "_id" -> user._id,
        "_createdAt" -> user._createdAt.map(date => BSONDateTime(date.getMillis)),
        "_updatedAt" -> user._updatedAt.map(date => BSONDateTime(date.getMillis)),
        "userName" -> user.userName,
        "passwordHash" -> user.passwordHash,
        "token" -> user.token,
        "tokenExpiration" -> user.tokenExpiration.map(token => BSONDateTime(token.getMillis))
      )
    }
  }
}