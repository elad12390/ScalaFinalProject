package repositories

import entitites.AccountOperation
import models.requests.GetAccountOperationsFilterRequest
import org.joda.time.DateTime
import reactivemongo.api.bson.collection.BSONCollection
import play.modules.reactivemongo.{NamedDatabase, ReactiveMongoApi}
import reactivemongo.api.commands.WriteResult
import reactivemongo.api.{Cursor, ReadPreference}
import reactivemongo.bson.{BSONDateTime, BSONDocument, BSONObjectID}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class AccountOperationRepository  @Inject()(
                                             implicit executionContext: ExecutionContext,
                                             val reactiveMongoApi: ReactiveMongoApi
                                           ) {
  def collection: Future[BSONCollection] = reactiveMongoApi.database.map(db => db.collection("accountoperations"))

  def getAll(filter: GetAccountOperationsFilterRequest): Future[Seq[AccountOperation]] = {
    var doc = BSONDocument() // new document to compare with
    if (filter.userId.nonEmpty) {
      doc = doc ++ BSONDocument("_createBy" -> filter.userId.get)
    }

    if (filter.accountNumber.nonEmpty) {
      doc = doc ++ BSONDocument("accountNumber" -> filter.accountNumber.get)
    }

    if (filter.actionType.nonEmpty) {
      doc = doc ++ BSONDocument("actionType" -> filter.actionType)
    }

    if (filter.amount.nonEmpty) {
      doc = doc ++ BSONDocument("amount" -> filter.amount)
    }

    if (filter.fromDate.nonEmpty || filter.toDate.nonEmpty) {
      var dateFilter = BSONDocument()
      if (filter.fromDate.nonEmpty) {
        dateFilter = dateFilter ++ BSONDocument("$gte" -> BSONDateTime(filter.fromDate.get.getMillis))
      }
      if (filter.toDate.nonEmpty) {
        dateFilter = dateFilter ++ BSONDocument("$lte" -> BSONDateTime(filter.toDate.get.getMillis))
      }
      doc = doc ++ BSONDocument("_createdAt" -> dateFilter)
    }

    collection.flatMap(
      _.find(doc, Option.empty[AccountOperation])
        .cursor[AccountOperation](ReadPreference.Primary)
        .collect(Int.MaxValue, Cursor.FailOnError[Seq[AccountOperation]]())
    )
  }

  def getById(id: BSONObjectID): Future[Option[AccountOperation]] = {
    collection.flatMap(_.find(BSONDocument("_id" -> id), Option.empty[AccountOperation]).one[AccountOperation])
  }

  def create(newOperation: AccountOperation): Future[WriteResult] = {
    collection.flatMap(_.insert(ordered = false)
      .one(newOperation.copy(_createdAt = Some(new DateTime()), _updatedAt = Some(DateTime.now))))
  }

  def update(id: BSONObjectID, newOperation: AccountOperation): Future[WriteResult] = {
    collection.flatMap(
      _.update(ordered = false)
        .one(BSONDocument("_id" -> id), newOperation.copy(_id = Some(id), _updatedAt = Some(DateTime.now)))
    )
  }

  def delete(id: BSONObjectID): Future[WriteResult] = {
    collection.flatMap(_.delete(ordered = false)
      .one(BSONDocument("_id" -> id), Some(1)))
  }
}
