package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CriteriaPropery;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CriteriaPropery entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CriteriaProperyRepository extends JpaRepository<CriteriaPropery, Long> {}
