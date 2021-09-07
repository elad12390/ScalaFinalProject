package models.requests

import org.joda.time.DateTime
import play.api.libs.json.{Format, JsString, Json, Reads, Writes}
import play.api.mvc.QueryStringBindable

import java.util.Date

case class GetAccountOperationsFilterRequest(
                                            var accountNumber: Option[Int] = None,
                                            var actionType: Option[Int] = None,
                                            var fromDate: Option[DateTime] = None,
                                            var toDate: Option[DateTime] = None,
                                            var amount: Option[Double] = None
                                            )
object GetAccountOperationsFilterRequest {
  implicit val tsreads: Reads[DateTime] = Reads.of[String] map { new DateTime(_) }
  implicit val tswrites: Writes[DateTime] = Writes { (dt: DateTime) => JsString(dt.toString)}

  implicit val fmt : Format[GetAccountOperationsFilterRequest] = Json.format[GetAccountOperationsFilterRequest]

  def map2GetAccountOperationsFilterRequest(map: Map[String, String]): GetAccountOperationsFilterRequest = {
    var filter = GetAccountOperationsFilterRequest()
    if (map.contains("accountNumber")) {
      filter.accountNumber = map.get("accountNumber").map(_.toInt)
    }
    if (map.contains("actionType")) {
      filter.actionType = map.get("actionType").map(_.toInt)
    }
    if (map.contains("fromDate")) {
      filter.fromDate = map.get("fromDate").map(DateTime.parse)
    }
    if (map.contains("toDate")) {
      filter.toDate = map.get("toDate").map(DateTime.parse)
    }
    if (map.contains("amount")) {
      filter.amount = map.get("amount").map(_.toDouble)
    }
    filter
  }

}