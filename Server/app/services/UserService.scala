package services

import akka.actor.ActorSystem
import entitites.{AccountOperation, User}
import enums.InnerErrorCodes
import models.exceptions.ApiResponseException
import models.requests.{AuthRequest, GetAccountOperationsFilterRequest}
import models.responses.AuthResponse
import org.joda.time.DateTime
import org.mindrot.jbcrypt.BCrypt
import reactivemongo.api.commands.WriteResult
import reactivemongo.bson.BSONObjectID
import repositories.{AccountOperationRepository, UserRepository}
import utils.utils._

import javax.inject._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}


class UserService @Inject()(actorSystem: ActorSystem, userRepository: UserRepository)(implicit exec: ExecutionContext ) extends MyBaseService(actorSystem, exec) {

  def register(req: AuthRequest): Future[AuthResponse] = {
    userRepository.getByUserName(req.userName).flatMap(user => {
      if (user.nonEmpty) {
        throw ApiResponseException(InnerErrorCodes.UserAlreadyExists)
      }

      val pwdHash = BCrypt.hashpw(req.userName + req.password, BCrypt.gensalt)
      val loginToken = BCrypt.hashpw(req.userName + req.password + new DateTime(), BCrypt.gensalt)
      val expiration = new DateTime().plusDays(1)

      val result = userRepository.create(User(
        userName=Some(req.userName),
        passwordHash=Some(pwdHash),
        token = Some(loginToken),
        tokenExpiration = Some(expiration)
      )).map(_ => AuthResponse(req.userName, loginToken))

      result
    })
  }

  def login(req: AuthRequest): Future[AuthResponse] = {
    userRepository.getByUserName(req.userName).map[AuthResponse](user => {
      if (user.nonEmpty) {
        if (BCrypt.checkpw(req.userName + req.password, user.get.passwordHash.get)) {
          val loginToken = BCrypt.hashpw(req.userName + req.password + new DateTime(), BCrypt.gensalt)
          val newExpiration = new DateTime().plusDays(1)

          var newUserData = user.get.copy(tokenExpiration = Some(newExpiration), token = Some(loginToken))
          userRepository.update(user.get._id.get, newUserData)

          AuthResponse(req.userName, loginToken)
        } else {
          throw ApiResponseException(InnerErrorCodes.UserOrPasswordWrong)
        }
      } else {
        throw ApiResponseException(InnerErrorCodes.UserNotFound)
      }
    })
  }

  def isLoggedIn(req: (String, String)): Future[Boolean] = {
    userRepository.getByUserName(req._1).map(user => {
        user.nonEmpty && user.get.tokenExpiration.get.isAfter(DateTime.now()) && user.get.token.get == req._2
    })
  }
}
