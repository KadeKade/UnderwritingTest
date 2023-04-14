package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CriteriaPropery;
import com.mycompany.myapp.repository.CriteriaProperyRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CriteriaPropery}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CriteriaProperyResource {

    private final Logger log = LoggerFactory.getLogger(CriteriaProperyResource.class);

    private static final String ENTITY_NAME = "criteriaPropery";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CriteriaProperyRepository criteriaProperyRepository;

    public CriteriaProperyResource(CriteriaProperyRepository criteriaProperyRepository) {
        this.criteriaProperyRepository = criteriaProperyRepository;
    }

    /**
     * {@code POST  /criteria-properies} : Create a new criteriaPropery.
     *
     * @param criteriaPropery the criteriaPropery to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new criteriaPropery, or with status {@code 400 (Bad Request)} if the criteriaPropery has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/criteria-properies")
    public ResponseEntity<CriteriaPropery> createCriteriaPropery(@RequestBody CriteriaPropery criteriaPropery) throws URISyntaxException {
        log.debug("REST request to save CriteriaPropery : {}", criteriaPropery);
        if (criteriaPropery.getId() != null) {
            throw new BadRequestAlertException("A new criteriaPropery cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CriteriaPropery result = criteriaProperyRepository.save(criteriaPropery);
        return ResponseEntity
            .created(new URI("/api/criteria-properies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /criteria-properies/:id} : Updates an existing criteriaPropery.
     *
     * @param id the id of the criteriaPropery to save.
     * @param criteriaPropery the criteriaPropery to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated criteriaPropery,
     * or with status {@code 400 (Bad Request)} if the criteriaPropery is not valid,
     * or with status {@code 500 (Internal Server Error)} if the criteriaPropery couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/criteria-properies/{id}")
    public ResponseEntity<CriteriaPropery> updateCriteriaPropery(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CriteriaPropery criteriaPropery
    ) throws URISyntaxException {
        log.debug("REST request to update CriteriaPropery : {}, {}", id, criteriaPropery);
        if (criteriaPropery.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, criteriaPropery.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criteriaProperyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CriteriaPropery result = criteriaProperyRepository.save(criteriaPropery);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, criteriaPropery.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /criteria-properies/:id} : Partial updates given fields of an existing criteriaPropery, field will ignore if it is null
     *
     * @param id the id of the criteriaPropery to save.
     * @param criteriaPropery the criteriaPropery to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated criteriaPropery,
     * or with status {@code 400 (Bad Request)} if the criteriaPropery is not valid,
     * or with status {@code 404 (Not Found)} if the criteriaPropery is not found,
     * or with status {@code 500 (Internal Server Error)} if the criteriaPropery couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/criteria-properies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CriteriaPropery> partialUpdateCriteriaPropery(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CriteriaPropery criteriaPropery
    ) throws URISyntaxException {
        log.debug("REST request to partial update CriteriaPropery partially : {}, {}", id, criteriaPropery);
        if (criteriaPropery.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, criteriaPropery.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criteriaProperyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CriteriaPropery> result = criteriaProperyRepository
            .findById(criteriaPropery.getId())
            .map(existingCriteriaPropery -> {
                if (criteriaPropery.getPropertyName() != null) {
                    existingCriteriaPropery.setPropertyName(criteriaPropery.getPropertyName());
                }
                if (criteriaPropery.getDisplayNameDe() != null) {
                    existingCriteriaPropery.setDisplayNameDe(criteriaPropery.getDisplayNameDe());
                }
                if (criteriaPropery.getDisplayNameEn() != null) {
                    existingCriteriaPropery.setDisplayNameEn(criteriaPropery.getDisplayNameEn());
                }
                if (criteriaPropery.getDisplayNameFr() != null) {
                    existingCriteriaPropery.setDisplayNameFr(criteriaPropery.getDisplayNameFr());
                }
                if (criteriaPropery.getDisplayNameIt() != null) {
                    existingCriteriaPropery.setDisplayNameIt(criteriaPropery.getDisplayNameIt());
                }

                return existingCriteriaPropery;
            })
            .map(criteriaProperyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, criteriaPropery.getId().toString())
        );
    }

    /**
     * {@code GET  /criteria-properies} : get all the criteriaProperies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of criteriaProperies in body.
     */
    @GetMapping("/criteria-properies")
    public List<CriteriaPropery> getAllCriteriaProperies() {
        log.debug("REST request to get all CriteriaProperies");
        return criteriaProperyRepository.findAll();
    }

    /**
     * {@code GET  /criteria-properies/:id} : get the "id" criteriaPropery.
     *
     * @param id the id of the criteriaPropery to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the criteriaPropery, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/criteria-properies/{id}")
    public ResponseEntity<CriteriaPropery> getCriteriaPropery(@PathVariable Long id) {
        log.debug("REST request to get CriteriaPropery : {}", id);
        Optional<CriteriaPropery> criteriaPropery = criteriaProperyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(criteriaPropery);
    }

    /**
     * {@code DELETE  /criteria-properies/:id} : delete the "id" criteriaPropery.
     *
     * @param id the id of the criteriaPropery to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/criteria-properies/{id}")
    public ResponseEntity<Void> deleteCriteriaPropery(@PathVariable Long id) {
        log.debug("REST request to delete CriteriaPropery : {}", id);
        criteriaProperyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
