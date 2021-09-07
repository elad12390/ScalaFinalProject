package models.responses

import play.api.libs.json.{Format, Json}

case class AuthResponse(
                           userName: String,
                           token: String
                       )


object AuthResponse {
  implicit val fmt : Format[AuthResponse] = Json.format[AuthResponse]
}