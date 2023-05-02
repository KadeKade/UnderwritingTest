package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CriteriaProperty;
import com.mycompany.myapp.repository.CriteriaPropertyRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CriteriaProperty}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CriteriaPropertyResource {

    private final Logger log = LoggerFactory.getLogger(CriteriaPropertyResource.class);

    private static final String ENTITY_NAME = "criteriaProperty";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CriteriaPropertyRepository criteriaPropertyRepository;

    public CriteriaPropertyResource(CriteriaPropertyRepository criteriaPropertyRepository) {
        this.criteriaPropertyRepository = criteriaPropertyRepository;
    }

    /**
     * {@code POST  /criteria-properties} : Create a new criteriaProperty.
     *
     * @param criteriaProperty the criteriaProperty to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new criteriaProperty, or with status {@code 400 (Bad Request)} if the criteriaProperty has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/criteria-properties")
    public ResponseEntity<CriteriaProperty> createCriteriaProperty(@RequestBody CriteriaProperty criteriaProperty)
        throws URISyntaxException {
        log.debug("REST request to save CriteriaProperty : {}", criteriaProperty);
        if (criteriaProperty.getId() != null) {
            throw new BadRequestAlertException("A new criteriaProperty cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CriteriaProperty result = criteriaPropertyRepository.save(criteriaProperty);
        return ResponseEntity
            .created(new URI("/api/criteria-properties/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /criteria-properties/:id} : Updates an existing criteriaProperty.
     *
     * @param id the id of the criteriaProperty to save.
     * @param criteriaProperty the criteriaProperty to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated criteriaProperty,
     * or with status {@code 400 (Bad Request)} if the criteriaProperty is not valid,
     * or with status {@code 500 (Internal Server Error)} if the criteriaProperty couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/criteria-properties/{id}")
    public ResponseEntity<CriteriaProperty> updateCriteriaProperty(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CriteriaProperty criteriaProperty
    ) throws URISyntaxException {
        log.debug("REST request to update CriteriaProperty : {}, {}", id, criteriaProperty);
        if (criteriaProperty.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, criteriaProperty.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criteriaPropertyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CriteriaProperty result = criteriaPropertyRepository.save(criteriaProperty);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, criteriaProperty.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /criteria-properties/:id} : Partial updates given fields of an existing criteriaProperty, field will ignore if it is null
     *
     * @param id the id of the criteriaProperty to save.
     * @param criteriaProperty the criteriaProperty to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated criteriaProperty,
     * or with status {@code 400 (Bad Request)} if the criteriaProperty is not valid,
     * or with status {@code 404 (Not Found)} if the criteriaProperty is not found,
     * or with status {@code 500 (Internal Server Error)} if the criteriaProperty couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/criteria-properties/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CriteriaProperty> partialUpdateCriteriaProperty(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CriteriaProperty criteriaProperty
    ) throws URISyntaxException {
        log.debug("REST request to partial update CriteriaProperty partially : {}, {}", id, criteriaProperty);
        if (criteriaProperty.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, criteriaProperty.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criteriaPropertyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CriteriaProperty> result = criteriaPropertyRepository
            .findById(criteriaProperty.getId())
            .map(existingCriteriaProperty -> {
                if (criteriaProperty.getPropertyName() != null) {
                    existingCriteriaProperty.setPropertyName(criteriaProperty.getPropertyName());
                }
                if (criteriaProperty.getPropertyType() != null) {
                    existingCriteriaProperty.setPropertyType(criteriaProperty.getPropertyType());
                }
                if (criteriaProperty.getDisplayNameDe() != null) {
                    existingCriteriaProperty.setDisplayNameDe(criteriaProperty.getDisplayNameDe());
                }
                if (criteriaProperty.getDisplayNameEn() != null) {
                    existingCriteriaProperty.setDisplayNameEn(criteriaProperty.getDisplayNameEn());
                }
                if (criteriaProperty.getDisplayNameFr() != null) {
                    existingCriteriaProperty.setDisplayNameFr(criteriaProperty.getDisplayNameFr());
                }
                if (criteriaProperty.getDisplayNameIt() != null) {
                    existingCriteriaProperty.setDisplayNameIt(criteriaProperty.getDisplayNameIt());
                }

                return existingCriteriaProperty;
            })
            .map(criteriaPropertyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, criteriaProperty.getId().toString())
        );
    }

    /**
     * {@code GET  /criteria-properties} : get all the criteriaProperties.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of criteriaProperties in body.
     */
    @GetMapping("/criteria-properties")
    public List<CriteriaProperty> getAllCriteriaProperties() {
        log.debug("REST request to get all CriteriaProperties");
        return criteriaPropertyRepository.findAll();
    }

    /**
     * {@code GET  /criteria-properties/:id} : get the "id" criteriaProperty.
     *
     * @param id the id of the criteriaProperty to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the criteriaProperty, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/criteria-properties/{id}")
    public ResponseEntity<CriteriaProperty> getCriteriaProperty(@PathVariable Long id) {
        log.debug("REST request to get CriteriaProperty : {}", id);
        Optional<CriteriaProperty> criteriaProperty = criteriaPropertyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(criteriaProperty);
    }

    /**
     * {@code DELETE  /criteria-properties/:id} : delete the "id" criteriaProperty.
     *
     * @param id the id of the criteriaProperty to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/criteria-properties/{id}")
    public ResponseEntity<Void> deleteCriteriaProperty(@PathVariable Long id) {
        log.debug("REST request to delete CriteriaProperty : {}", id);
        criteriaPropertyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
