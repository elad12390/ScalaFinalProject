package repositories

import entitites.{User}
import org.joda.time.DateTime
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.bson.collection.BSONCollection
import reactivemongo.api.commands.WriteResult
import reactivemongo.api.{Cursor, ReadPreference}
import reactivemongo.bson.{BSONDateTime, BSONDocument, BSONObjectID}

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class UserRepository  @Inject()(
                                 implicit executionContext: ExecutionContext,
                                 val reactiveMongoApi: ReactiveMongoApi
                               ) {
  def collection: Future[BSONCollection] = reactiveMongoApi.database.map(db => db.collection("user"))

  def getAll(): Future[Seq[User]] = {
    collection.flatMap(
      _.find(BSONDocument(), Option.empty[User])
        .cursor[User](ReadPreference.Primary)
        .collect(Int.MaxValue, Cursor.FailOnError[Seq[User]]())
    )
  }

  def getByUserName(userName: String): Future[Option[User]] = {
    collection.flatMap(_.find(BSONDocument("userName" -> userName), Option.empty[User]).one[User])
  }

  def getById(id: BSONObjectID): Future[Option[User]] = {
    collection.flatMap(_.find(BSONDocument("_id" -> id), Option.empty[User]).one[User])
  }

  def create(user: User): Future[WriteResult] = {
    collection.flatMap(_.insert(ordered = false)
      .one(user.copy(_createdAt = Some(new DateTime()), _updatedAt = Some(DateTime.now))))
  }

  def update(id: BSONObjectID, user: User): Future[WriteResult] = {
    collection.flatMap(
      _.update(ordered = false)
        .one(BSONDocument("_id" -> id), user.copy(_updatedAt = Some(DateTime.now)))
    )
  }

  def delete(id: BSONObjectID): Future[WriteResult] = {
    collection.flatMap(_.delete(ordered = false)
      .one(BSONDocument("_id" -> id), Some(1)))
  }
}
