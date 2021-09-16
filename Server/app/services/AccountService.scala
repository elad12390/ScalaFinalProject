package services

import javax.inject._
import akka.actor.ActorSystem
import entitites.AccountOperation
import models.requests.GetAccountOperationsFilterRequest
import reactivemongo.api.bson.BSONObjectID
import reactivemongo.api.commands.WriteResult
import repositories.AccountOperationRepository

import scala.concurrent.{ExecutionContext, Future}
import utils.utils._


class AccountService @Inject()(actorSystem: ActorSystem, accountOperationRepository: AccountOperationRepository)(implicit exec: ExecutionContext ) extends MyBaseService(actorSystem, exec) {

  def getBalance(id: String): Future[Double] = {
    useBSONObjectId(id)(accountOperationRepository.getBalance)
  }

  def getAll(filter: GetAccountOperationsFilterRequest): Future[Seq[AccountOperation]] = {
    accountOperationRepository.getAll(filter)
  }

  def getById(id: String): Future[Option[AccountOperation]] = {
    useBSONObjectId(id)(accountOperationRepository.getById)
  }

  def create(newOperation: AccountOperation): Future[WriteResult] = {
    accountOperationRepository.create(newOperation)
  }

  def update(id: String, newOperation: AccountOperation): Future[WriteResult] = {
    useBSONObjectId(id, newOperation)(accountOperationRepository.update)
  }

  def delete(id: String): Future[WriteResult] = {
    useBSONObjectId(id)(accountOperationRepository.delete)
  }
}
