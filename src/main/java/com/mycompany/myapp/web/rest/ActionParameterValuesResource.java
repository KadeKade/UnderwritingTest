package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ActionParameterValues;
import com.mycompany.myapp.repository.ActionParameterValuesRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ActionParameterValues}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActionParameterValuesResource {

    private final Logger log = LoggerFactory.getLogger(ActionParameterValuesResource.class);

    private static final String ENTITY_NAME = "actionParameterValues";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActionParameterValuesRepository actionParameterValuesRepository;

    public ActionParameterValuesResource(ActionParameterValuesRepository actionParameterValuesRepository) {
        this.actionParameterValuesRepository = actionParameterValuesRepository;
    }

    /**
     * {@code POST  /action-parameter-values} : Create a new actionParameterValues.
     *
     * @param actionParameterValues the actionParameterValues to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new actionParameterValues, or with status {@code 400 (Bad Request)} if the actionParameterValues has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/action-parameter-values")
    public ResponseEntity<ActionParameterValues> createActionParameterValues(@RequestBody ActionParameterValues actionParameterValues)
        throws URISyntaxException {
        log.debug("REST request to save ActionParameterValues : {}", actionParameterValues);
        if (actionParameterValues.getId() != null) {
            throw new BadRequestAlertException("A new actionParameterValues cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActionParameterValues result = actionParameterValuesRepository.save(actionParameterValues);
        return ResponseEntity
            .created(new URI("/api/action-parameter-values/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /action-parameter-values/:id} : Updates an existing actionParameterValues.
     *
     * @param id the id of the actionParameterValues to save.
     * @param actionParameterValues the actionParameterValues to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actionParameterValues,
     * or with status {@code 400 (Bad Request)} if the actionParameterValues is not valid,
     * or with status {@code 500 (Internal Server Error)} if the actionParameterValues couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/action-parameter-values/{id}")
    public ResponseEntity<ActionParameterValues> updateActionParameterValues(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActionParameterValues actionParameterValues
    ) throws URISyntaxException {
        log.debug("REST request to update ActionParameterValues : {}, {}", id, actionParameterValues);
        if (actionParameterValues.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actionParameterValues.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actionParameterValuesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActionParameterValues result = actionParameterValuesRepository.save(actionParameterValues);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, actionParameterValues.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /action-parameter-values/:id} : Partial updates given fields of an existing actionParameterValues, field will ignore if it is null
     *
     * @param id the id of the actionParameterValues to save.
     * @param actionParameterValues the actionParameterValues to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actionParameterValues,
     * or with status {@code 400 (Bad Request)} if the actionParameterValues is not valid,
     * or with status {@code 404 (Not Found)} if the actionParameterValues is not found,
     * or with status {@code 500 (Internal Server Error)} if the actionParameterValues couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/action-parameter-values/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ActionParameterValues> partialUpdateActionParameterValues(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActionParameterValues actionParameterValues
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActionParameterValues partially : {}, {}", id, actionParameterValues);
        if (actionParameterValues.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actionParameterValues.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actionParameterValuesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActionParameterValues> result = actionParameterValuesRepository
            .findById(actionParameterValues.getId())
            .map(existingActionParameterValues -> {
                if (actionParameterValues.getParameterValue() != null) {
                    existingActionParameterValues.setParameterValue(actionParameterValues.getParameterValue());
                }

                return existingActionParameterValues;
            })
            .map(actionParameterValuesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, actionParameterValues.getId().toString())
        );
    }

    /**
     * {@code GET  /action-parameter-values} : get all the actionParameterValues.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actionParameterValues in body.
     */
    @GetMapping("/action-parameter-values")
    public List<ActionParameterValues> getAllActionParameterValues() {
        log.debug("REST request to get all ActionParameterValues");
        return actionParameterValuesRepository.findAll();
    }

    /**
     * {@code GET  /action-parameter-values/:id} : get the "id" actionParameterValues.
     *
     * @param id the id of the actionParameterValues to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the actionParameterValues, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/action-parameter-values/{id}")
    public ResponseEntity<ActionParameterValues> getActionParameterValues(@PathVariable Long id) {
        log.debug("REST request to get ActionParameterValues : {}", id);
        Optional<ActionParameterValues> actionParameterValues = actionParameterValuesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(actionParameterValues);
    }

    /**
     * {@code DELETE  /action-parameter-values/:id} : delete the "id" actionParameterValues.
     *
     * @param id the id of the actionParameterValues to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/action-parameter-values/{id}")
    public ResponseEntity<Void> deleteActionParameterValues(@PathVariable Long id) {
        log.debug("REST request to delete ActionParameterValues : {}", id);
        actionParameterValuesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
