package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ParameterValue;
import com.mycompany.myapp.repository.ParameterValueRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ParameterValue}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParameterValueResource {

    private final Logger log = LoggerFactory.getLogger(ParameterValueResource.class);

    private static final String ENTITY_NAME = "parameterValue";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParameterValueRepository parameterValueRepository;

    public ParameterValueResource(ParameterValueRepository parameterValueRepository) {
        this.parameterValueRepository = parameterValueRepository;
    }

    /**
     * {@code POST  /parameter-values} : Create a new parameterValue.
     *
     * @param parameterValue the parameterValue to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parameterValue, or with status {@code 400 (Bad Request)} if the parameterValue has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parameter-values")
    public ResponseEntity<ParameterValue> createParameterValue(@RequestBody ParameterValue parameterValue) throws URISyntaxException {
        log.debug("REST request to save ParameterValue : {}", parameterValue);
        if (parameterValue.getId() != null) {
            throw new BadRequestAlertException("A new parameterValue cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ParameterValue result = parameterValueRepository.save(parameterValue);
        return ResponseEntity
            .created(new URI("/api/parameter-values/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parameter-values/:id} : Updates an existing parameterValue.
     *
     * @param id the id of the parameterValue to save.
     * @param parameterValue the parameterValue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parameterValue,
     * or with status {@code 400 (Bad Request)} if the parameterValue is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parameterValue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parameter-values/{id}")
    public ResponseEntity<ParameterValue> updateParameterValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ParameterValue parameterValue
    ) throws URISyntaxException {
        log.debug("REST request to update ParameterValue : {}, {}", id, parameterValue);
        if (parameterValue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parameterValue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parameterValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ParameterValue result = parameterValueRepository.save(parameterValue);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parameterValue.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parameter-values/:id} : Partial updates given fields of an existing parameterValue, field will ignore if it is null
     *
     * @param id the id of the parameterValue to save.
     * @param parameterValue the parameterValue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parameterValue,
     * or with status {@code 400 (Bad Request)} if the parameterValue is not valid,
     * or with status {@code 404 (Not Found)} if the parameterValue is not found,
     * or with status {@code 500 (Internal Server Error)} if the parameterValue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parameter-values/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ParameterValue> partialUpdateParameterValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ParameterValue parameterValue
    ) throws URISyntaxException {
        log.debug("REST request to partial update ParameterValue partially : {}, {}", id, parameterValue);
        if (parameterValue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parameterValue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parameterValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ParameterValue> result = parameterValueRepository
            .findById(parameterValue.getId())
            .map(existingParameterValue -> {
                if (parameterValue.getActionParameterValue() != null) {
                    existingParameterValue.setActionParameterValue(parameterValue.getActionParameterValue());
                }

                return existingParameterValue;
            })
            .map(parameterValueRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parameterValue.getId().toString())
        );
    }

    /**
     * {@code GET  /parameter-values} : get all the parameterValues.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parameterValues in body.
     */
    @GetMapping("/parameter-values")
    public List<ParameterValue> getAllParameterValues() {
        log.debug("REST request to get all ParameterValues");
        return parameterValueRepository.findAll();
    }

    /**
     * {@code GET  /parameter-values/:id} : get the "id" parameterValue.
     *
     * @param id the id of the parameterValue to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parameterValue, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parameter-values/{id}")
    public ResponseEntity<ParameterValue> getParameterValue(@PathVariable Long id) {
        log.debug("REST request to get ParameterValue : {}", id);
        Optional<ParameterValue> parameterValue = parameterValueRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parameterValue);
    }

    /**
     * {@code DELETE  /parameter-values/:id} : delete the "id" parameterValue.
     *
     * @param id the id of the parameterValue to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parameter-values/{id}")
    public ResponseEntity<Void> deleteParameterValue(@PathVariable Long id) {
        log.debug("REST request to delete ParameterValue : {}", id);
        parameterValueRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
