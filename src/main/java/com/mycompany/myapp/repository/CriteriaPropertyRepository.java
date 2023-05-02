package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CriteriaProperty;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CriteriaProperty entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CriteriaPropertyRepository extends JpaRepository<CriteriaProperty, Long> {}
