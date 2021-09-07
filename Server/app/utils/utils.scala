package utils

import reactivemongo.bson.BSONObjectID

import scala.util.{Failure, Success}

object utils {
  def useBSONObjectId[T](id: String)(fn: BSONObjectID => T): T = {
    val objectId = BSONObjectID.parse(id)
    objectId match {
      case Success(objectId) => fn(objectId)
      case Failure(exception) => throw new Exception("Cannot parse the movie id")
    }
  }
  def useBSONObjectId[S, T](id: String, data: S)(fn: (BSONObjectID, S) => T): T = {
    val objectId = BSONObjectID.parse(id)
    objectId match {
      case Success(objectId) => fn(objectId, data)
      case Failure(exception) => throw new Exception("Cannot parse the movie id")
    }
  }
}
