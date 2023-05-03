package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CriteriaSet;
import com.mycompany.myapp.repository.CriteriaSetRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CriteriaSet}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CriteriaSetResource {

    private final Logger log = LoggerFactory.getLogger(CriteriaSetResource.class);

    private static final String ENTITY_NAME = "criteriaSet";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CriteriaSetRepository criteriaSetRepository;

    public CriteriaSetResource(CriteriaSetRepository criteriaSetRepository) {
        this.criteriaSetRepository = criteriaSetRepository;
    }

    /**
     * {@code POST  /criteria-sets} : Create a new criteriaSet.
     *
     * @param criteriaSet the criteriaSet to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new criteriaSet, or with status {@code 400 (Bad Request)} if the criteriaSet has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/criteria-sets")
    public ResponseEntity<CriteriaSet> createCriteriaSet(@RequestBody CriteriaSet criteriaSet) throws URISyntaxException {
        log.debug("REST request to save CriteriaSet : {}", criteriaSet);
        if (criteriaSet.getId() != null) {
            throw new BadRequestAlertException("A new criteriaSet cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CriteriaSet result = criteriaSetRepository.save(criteriaSet);
        return ResponseEntity
            .created(new URI("/api/criteria-sets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /criteria-sets/:id} : Updates an existing criteriaSet.
     *
     * @param id the id of the criteriaSet to save.
     * @param criteriaSet the criteriaSet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated criteriaSet,
     * or with status {@code 400 (Bad Request)} if the criteriaSet is not valid,
     * or with status {@code 500 (Internal Server Error)} if the criteriaSet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/criteria-sets/{id}")
    public ResponseEntity<CriteriaSet> updateCriteriaSet(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CriteriaSet criteriaSet
    ) throws URISyntaxException {
        log.debug("REST request to update CriteriaSet : {}, {}", id, criteriaSet);
        if (criteriaSet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, criteriaSet.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criteriaSetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CriteriaSet result = criteriaSetRepository.save(criteriaSet);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, criteriaSet.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /criteria-sets/:id} : Partial updates given fields of an existing criteriaSet, field will ignore if it is null
     *
     * @param id the id of the criteriaSet to save.
     * @param criteriaSet the criteriaSet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated criteriaSet,
     * or with status {@code 400 (Bad Request)} if the criteriaSet is not valid,
     * or with status {@code 404 (Not Found)} if the criteriaSet is not found,
     * or with status {@code 500 (Internal Server Error)} if the criteriaSet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/criteria-sets/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CriteriaSet> partialUpdateCriteriaSet(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CriteriaSet criteriaSet
    ) throws URISyntaxException {
        log.debug("REST request to partial update CriteriaSet partially : {}, {}", id, criteriaSet);
        if (criteriaSet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, criteriaSet.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criteriaSetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CriteriaSet> result = criteriaSetRepository
            .findById(criteriaSet.getId())
            .map(existingCriteriaSet -> {
                if (criteriaSet.getName() != null) {
                    existingCriteriaSet.setName(criteriaSet.getName());
                }
                if (criteriaSet.getInsurerId() != null) {
                    existingCriteriaSet.setInsurerId(criteriaSet.getInsurerId());
                }
                if (criteriaSet.getLobId() != null) {
                    existingCriteriaSet.setLobId(criteriaSet.getLobId());
                }
                if (criteriaSet.getBrokerCategory() != null) {
                    existingCriteriaSet.setBrokerCategory(criteriaSet.getBrokerCategory());
                }

                return existingCriteriaSet;
            })
            .map(criteriaSetRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, criteriaSet.getId().toString())
        );
    }

    /**
     * {@code GET  /criteria-sets} : get all the criteriaSets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of criteriaSets in body.
     */
    @GetMapping("/criteria-sets")
    public List<CriteriaSet> getAllCriteriaSets() {
        log.debug("REST request to get all CriteriaSets");
        return criteriaSetRepository.findAll();
    }

    /**
     * {@code GET  /criteria-sets/:id} : get the "id" criteriaSet.
     *
     * @param id the id of the criteriaSet to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the criteriaSet, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/criteria-sets/{id}")
    public ResponseEntity<CriteriaSet> getCriteriaSet(@PathVariable Long id) {
        log.debug("REST request to get CriteriaSet : {}", id);
        Optional<CriteriaSet> criteriaSet = criteriaSetRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(criteriaSet);
    }

    /**
     * {@code DELETE  /criteria-sets/:id} : delete the "id" criteriaSet.
     *
     * @param id the id of the criteriaSet to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/criteria-sets/{id}")
    public ResponseEntity<Void> deleteCriteriaSet(@PathVariable Long id) {
        log.debug("REST request to delete CriteriaSet : {}", id);
        criteriaSetRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
