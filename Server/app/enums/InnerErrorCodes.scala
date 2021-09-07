package enums

object InnerErrorCodes extends Enumeration
{
  type InnerErrorCodes = Value
  val CannotParseObjectId: Value = Value(240, "Cannot parse id to bson id")

  val UserAlreadyExists: Value = Value(341, "User already exists")
  val UserNotFound: Value = Value(342, "User not found")
  val UserOrPasswordWrong: Value = Value(343, "Wrong username or password")

  val NotLoggedIn: Value = Value(442, "not logged in")


  val InternalServerError: Value = Value(9999, "Internal Server Error")
}
