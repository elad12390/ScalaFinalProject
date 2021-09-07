package models.requests

import play.api.libs.json.{Format, Json}

case class AuthRequest(
                           userName: String,
                           password: String
                       )

object AuthRequest {
  implicit val fmt : Format[AuthRequest] = Json.format[AuthRequest]
}