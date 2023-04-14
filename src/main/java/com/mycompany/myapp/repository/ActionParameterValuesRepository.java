package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ActionParameterValues;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ActionParameterValues entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActionParameterValuesRepository extends JpaRepository<ActionParameterValues, Long> {}
