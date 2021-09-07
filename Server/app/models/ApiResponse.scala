package models

import entitites.AccountOperation
import play.api.libs.json.{Format, Json}

case class ApiResponse[T](
                          data: Option[T] = None,
                          httpCode: Option[Int] = None,
                          errorCode: Option[Int] = None,
                          errorMessage: Option[String] = None,
                          displayMessage: Option[String] = None,
                          errorDescription: Option[String] = None,
                          exception: Option[Exception] = None
                         )

