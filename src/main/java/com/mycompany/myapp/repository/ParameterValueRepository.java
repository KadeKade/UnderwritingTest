package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ParameterValue;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ParameterValue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParameterValueRepository extends JpaRepository<ParameterValue, Long> {}
