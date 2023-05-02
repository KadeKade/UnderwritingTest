package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CriteriaSet;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CriteriaSet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CriteriaSetRepository extends JpaRepository<CriteriaSet, Long> {}
