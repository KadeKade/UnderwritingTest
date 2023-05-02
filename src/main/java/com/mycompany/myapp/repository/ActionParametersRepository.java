package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ActionParameters;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ActionParameters entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActionParametersRepository extends JpaRepository<ActionParameters, Long> {}
