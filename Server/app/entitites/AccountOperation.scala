package entitites
import org.joda.time.DateTime
import play.api.libs.json.{Format, Json}
import reactivemongo.play.json._
import reactivemongo.bson.BSONObjectID
import reactivemongo.bson._
import play.api.libs.json.JodaWrites._
import play.api.libs.json.JodaReads._


case class AccountOperation(
                  _id:            Option[BSONObjectID],
                  _createBy:      Option[BSONObjectID],
                  accountNumber:  Option[Int],
                  _createdAt:     Option[DateTime],
                  _updatedAt:     Option[DateTime],
                  actionType:     Option[Int],
                  amount:         Option[Double]
                )

object AccountOperation {
  implicit val fmt : Format[AccountOperation] = Json.format[AccountOperation]

  implicit object AccountOperationBSONReader extends BSONDocumentReader[AccountOperation] {
    def read(doc: BSONDocument): AccountOperation = {
      AccountOperation(
        doc.getAs[BSONObjectID]("_id"),
        doc.getAs[BSONObjectID]("_createBy"),
        doc.getAs[Int]("accountNumber"),

        doc.getAs[BSONDateTime]("_createdAt").map(dt => new DateTime(dt.value)),
        doc.getAs[BSONDateTime]("_updatedAt").map(dt => new DateTime(dt.value)),

        doc.getAs[Int]("actionType"),
        doc.getAs[Double]("amount")
      )
    }
  }

  implicit object AccountOperationBSONWriter extends BSONDocumentWriter[AccountOperation] {
    def write(AccountOperation: AccountOperation): BSONDocument = {
      BSONDocument(
        "_id" -> AccountOperation._id,
        "_createBy" -> AccountOperation._createBy,
        "accountNumber" -> AccountOperation.accountNumber,
        "_createdAt" -> AccountOperation._createdAt.map(date => BSONDateTime(date.getMillis)),
        "_updatedAt" -> AccountOperation._updatedAt.map(date => BSONDateTime(date.getMillis)),
        "actionType" -> AccountOperation.actionType,
        "amount" -> AccountOperation.amount
      )
    }
  }
}
