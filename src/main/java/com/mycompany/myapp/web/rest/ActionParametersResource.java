package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ActionParameters;
import com.mycompany.myapp.repository.ActionParametersRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ActionParameters}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActionParametersResource {

    private final Logger log = LoggerFactory.getLogger(ActionParametersResource.class);

    private static final String ENTITY_NAME = "actionParameters";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActionParametersRepository actionParametersRepository;

    public ActionParametersResource(ActionParametersRepository actionParametersRepository) {
        this.actionParametersRepository = actionParametersRepository;
    }

    /**
     * {@code POST  /action-parameters} : Create a new actionParameters.
     *
     * @param actionParameters the actionParameters to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new actionParameters, or with status {@code 400 (Bad Request)} if the actionParameters has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/action-parameters")
    public ResponseEntity<ActionParameters> createActionParameters(@RequestBody ActionParameters actionParameters)
        throws URISyntaxException {
        log.debug("REST request to save ActionParameters : {}", actionParameters);
        if (actionParameters.getId() != null) {
            throw new BadRequestAlertException("A new actionParameters cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActionParameters result = actionParametersRepository.save(actionParameters);
        return ResponseEntity
            .created(new URI("/api/action-parameters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /action-parameters/:id} : Updates an existing actionParameters.
     *
     * @param id the id of the actionParameters to save.
     * @param actionParameters the actionParameters to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actionParameters,
     * or with status {@code 400 (Bad Request)} if the actionParameters is not valid,
     * or with status {@code 500 (Internal Server Error)} if the actionParameters couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/action-parameters/{id}")
    public ResponseEntity<ActionParameters> updateActionParameters(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActionParameters actionParameters
    ) throws URISyntaxException {
        log.debug("REST request to update ActionParameters : {}, {}", id, actionParameters);
        if (actionParameters.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actionParameters.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actionParametersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActionParameters result = actionParametersRepository.save(actionParameters);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, actionParameters.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /action-parameters/:id} : Partial updates given fields of an existing actionParameters, field will ignore if it is null
     *
     * @param id the id of the actionParameters to save.
     * @param actionParameters the actionParameters to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actionParameters,
     * or with status {@code 400 (Bad Request)} if the actionParameters is not valid,
     * or with status {@code 404 (Not Found)} if the actionParameters is not found,
     * or with status {@code 500 (Internal Server Error)} if the actionParameters couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/action-parameters/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ActionParameters> partialUpdateActionParameters(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActionParameters actionParameters
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActionParameters partially : {}, {}", id, actionParameters);
        if (actionParameters.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actionParameters.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actionParametersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActionParameters> result = actionParametersRepository
            .findById(actionParameters.getId())
            .map(existingActionParameters -> {
                if (actionParameters.getParameterName() != null) {
                    existingActionParameters.setParameterName(actionParameters.getParameterName());
                }
                if (actionParameters.getDisplayNameDe() != null) {
                    existingActionParameters.setDisplayNameDe(actionParameters.getDisplayNameDe());
                }
                if (actionParameters.getDisplayNameEn() != null) {
                    existingActionParameters.setDisplayNameEn(actionParameters.getDisplayNameEn());
                }
                if (actionParameters.getDisplayNameFr() != null) {
                    existingActionParameters.setDisplayNameFr(actionParameters.getDisplayNameFr());
                }
                if (actionParameters.getDisplayNameIt() != null) {
                    existingActionParameters.setDisplayNameIt(actionParameters.getDisplayNameIt());
                }

                return existingActionParameters;
            })
            .map(actionParametersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, actionParameters.getId().toString())
        );
    }

    /**
     * {@code GET  /action-parameters} : get all the actionParameters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actionParameters in body.
     */
    @GetMapping("/action-parameters")
    public List<ActionParameters> getAllActionParameters() {
        log.debug("REST request to get all ActionParameters");
        return actionParametersRepository.findAll();
    }

    /**
     * {@code GET  /action-parameters/:id} : get the "id" actionParameters.
     *
     * @param id the id of the actionParameters to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the actionParameters, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/action-parameters/{id}")
    public ResponseEntity<ActionParameters> getActionParameters(@PathVariable Long id) {
        log.debug("REST request to get ActionParameters : {}", id);
        Optional<ActionParameters> actionParameters = actionParametersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(actionParameters);
    }

    /**
     * {@code DELETE  /action-parameters/:id} : delete the "id" actionParameters.
     *
     * @param id the id of the actionParameters to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/action-parameters/{id}")
    public ResponseEntity<Void> deleteActionParameters(@PathVariable Long id) {
        log.debug("REST request to delete ActionParameters : {}", id);
        actionParametersRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
