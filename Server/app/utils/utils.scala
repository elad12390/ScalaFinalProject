package utils

import enums.InnerErrorCodes
import models.exceptions.ApiResponseException
import reactivemongo.bson.BSONObjectID

import scala.util.{Failure, Success}

object utils {
  def useBSONObjectId[T](id: String)(fn: BSONObjectID => T): T = {
    val objectId = BSONObjectID.parse(id)
    objectId match {
      case Success(objectId) => fn(objectId)
      case Failure(exception) => throw ApiResponseException(InnerErrorCodes.CannotParseObjectId)
    }
  }
  def useBSONObjectId[S, T](id: String, data: S)(fn: (BSONObjectID, S) => T): T = {
    val objectId = BSONObjectID.parse(id)
    objectId match {
      case Success(objectId) => fn(objectId, data)
      case Failure(exception) => throw ApiResponseException(InnerErrorCodes.CannotParseObjectId)
    }
  }
}
