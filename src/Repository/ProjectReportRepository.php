<?php

namespace App\Repository;

use App\Entity\ProjectTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ProjectTime|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectTime|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectTime[]    findAll()
 * @method ProjectTime[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectReportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProjectTime::class);
    }

    public function findByDate()
    {
        return $this->createQueryBuilder('date')
            ->orderBy('date.createdAt', 'ASC')
            ->getQuery()
            ->getResult();
    }

    // /**
    //  * @return ProjectReport[] Returns an array of ProjectReport objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ProjectReport
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
