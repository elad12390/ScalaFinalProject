package models.requests

import org.joda.time.DateTime
import play.api.libs.json.{Format, JsString, Json, Reads, Writes}

import java.util.Date

case class GetAccountOperationsFilterRequest(
                                            accountNumber: Option[Int] = None,
                                            actionType: Option[Int] = None,
                                            fromDate: Option[DateTime] = None,
                                            toDate: Option[DateTime] = None,
                                            amount: Option[Double] = None
                                            )
object GetAccountOperationsFilterRequest {
  implicit val tsreads: Reads[DateTime] = Reads.of[String] map { new DateTime(_) }
  implicit val tswrites: Writes[DateTime] = Writes { (dt: DateTime) => JsString(dt.toString)}

  implicit val fmt : Format[GetAccountOperationsFilterRequest] = Json.format[GetAccountOperationsFilterRequest]
}