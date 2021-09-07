package models.exceptions

import enums.InnerErrorCodes
import play.api.libs.json.{Format, Json}

case class ApiResponseException(err: InnerErrorCodes.Value = InnerErrorCodes.InternalServerError) extends Exception(err.toString)