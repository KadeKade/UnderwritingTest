package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CriteriaPropery;
import com.mycompany.myapp.repository.CriteriaProperyRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CriteriaProperyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CriteriaProperyResourceIT {

    private static final String DEFAULT_PROPERTY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PROPERTY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_DE = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_DE = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_EN = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_EN = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_FR = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_FR = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_IT = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_IT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/criteria-properies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CriteriaProperyRepository criteriaProperyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCriteriaProperyMockMvc;

    private CriteriaPropery criteriaPropery;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CriteriaPropery createEntity(EntityManager em) {
        CriteriaPropery criteriaPropery = new CriteriaPropery()
            .propertyName(DEFAULT_PROPERTY_NAME)
            .displayNameDe(DEFAULT_DISPLAY_NAME_DE)
            .displayNameEn(DEFAULT_DISPLAY_NAME_EN)
            .displayNameFr(DEFAULT_DISPLAY_NAME_FR)
            .displayNameIt(DEFAULT_DISPLAY_NAME_IT);
        return criteriaPropery;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CriteriaPropery createUpdatedEntity(EntityManager em) {
        CriteriaPropery criteriaPropery = new CriteriaPropery()
            .propertyName(UPDATED_PROPERTY_NAME)
            .displayNameDe(UPDATED_DISPLAY_NAME_DE)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR)
            .displayNameIt(UPDATED_DISPLAY_NAME_IT);
        return criteriaPropery;
    }

    @BeforeEach
    public void initTest() {
        criteriaPropery = createEntity(em);
    }

    @Test
    @Transactional
    void createCriteriaPropery() throws Exception {
        int databaseSizeBeforeCreate = criteriaProperyRepository.findAll().size();
        // Create the CriteriaPropery
        restCriteriaProperyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteriaPropery))
            )
            .andExpect(status().isCreated());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeCreate + 1);
        CriteriaPropery testCriteriaPropery = criteriaProperyList.get(criteriaProperyList.size() - 1);
        assertThat(testCriteriaPropery.getPropertyName()).isEqualTo(DEFAULT_PROPERTY_NAME);
        assertThat(testCriteriaPropery.getDisplayNameDe()).isEqualTo(DEFAULT_DISPLAY_NAME_DE);
        assertThat(testCriteriaPropery.getDisplayNameEn()).isEqualTo(DEFAULT_DISPLAY_NAME_EN);
        assertThat(testCriteriaPropery.getDisplayNameFr()).isEqualTo(DEFAULT_DISPLAY_NAME_FR);
        assertThat(testCriteriaPropery.getDisplayNameIt()).isEqualTo(DEFAULT_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void createCriteriaProperyWithExistingId() throws Exception {
        // Create the CriteriaPropery with an existing ID
        criteriaPropery.setId(1L);

        int databaseSizeBeforeCreate = criteriaProperyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCriteriaProperyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteriaPropery))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCriteriaProperies() throws Exception {
        // Initialize the database
        criteriaProperyRepository.saveAndFlush(criteriaPropery);

        // Get all the criteriaProperyList
        restCriteriaProperyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(criteriaPropery.getId().intValue())))
            .andExpect(jsonPath("$.[*].propertyName").value(hasItem(DEFAULT_PROPERTY_NAME)))
            .andExpect(jsonPath("$.[*].displayNameDe").value(hasItem(DEFAULT_DISPLAY_NAME_DE)))
            .andExpect(jsonPath("$.[*].displayNameEn").value(hasItem(DEFAULT_DISPLAY_NAME_EN)))
            .andExpect(jsonPath("$.[*].displayNameFr").value(hasItem(DEFAULT_DISPLAY_NAME_FR)))
            .andExpect(jsonPath("$.[*].displayNameIt").value(hasItem(DEFAULT_DISPLAY_NAME_IT)));
    }

    @Test
    @Transactional
    void getCriteriaPropery() throws Exception {
        // Initialize the database
        criteriaProperyRepository.saveAndFlush(criteriaPropery);

        // Get the criteriaPropery
        restCriteriaProperyMockMvc
            .perform(get(ENTITY_API_URL_ID, criteriaPropery.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(criteriaPropery.getId().intValue()))
            .andExpect(jsonPath("$.propertyName").value(DEFAULT_PROPERTY_NAME))
            .andExpect(jsonPath("$.displayNameDe").value(DEFAULT_DISPLAY_NAME_DE))
            .andExpect(jsonPath("$.displayNameEn").value(DEFAULT_DISPLAY_NAME_EN))
            .andExpect(jsonPath("$.displayNameFr").value(DEFAULT_DISPLAY_NAME_FR))
            .andExpect(jsonPath("$.displayNameIt").value(DEFAULT_DISPLAY_NAME_IT));
    }

    @Test
    @Transactional
    void getNonExistingCriteriaPropery() throws Exception {
        // Get the criteriaPropery
        restCriteriaProperyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCriteriaPropery() throws Exception {
        // Initialize the database
        criteriaProperyRepository.saveAndFlush(criteriaPropery);

        int databaseSizeBeforeUpdate = criteriaProperyRepository.findAll().size();

        // Update the criteriaPropery
        CriteriaPropery updatedCriteriaPropery = criteriaProperyRepository.findById(criteriaPropery.getId()).get();
        // Disconnect from session so that the updates on updatedCriteriaPropery are not directly saved in db
        em.detach(updatedCriteriaPropery);
        updatedCriteriaPropery
            .propertyName(UPDATED_PROPERTY_NAME)
            .displayNameDe(UPDATED_DISPLAY_NAME_DE)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR)
            .displayNameIt(UPDATED_DISPLAY_NAME_IT);

        restCriteriaProperyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCriteriaPropery.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCriteriaPropery))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeUpdate);
        CriteriaPropery testCriteriaPropery = criteriaProperyList.get(criteriaProperyList.size() - 1);
        assertThat(testCriteriaPropery.getPropertyName()).isEqualTo(UPDATED_PROPERTY_NAME);
        assertThat(testCriteriaPropery.getDisplayNameDe()).isEqualTo(UPDATED_DISPLAY_NAME_DE);
        assertThat(testCriteriaPropery.getDisplayNameEn()).isEqualTo(UPDATED_DISPLAY_NAME_EN);
        assertThat(testCriteriaPropery.getDisplayNameFr()).isEqualTo(UPDATED_DISPLAY_NAME_FR);
        assertThat(testCriteriaPropery.getDisplayNameIt()).isEqualTo(UPDATED_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void putNonExistingCriteriaPropery() throws Exception {
        int databaseSizeBeforeUpdate = criteriaProperyRepository.findAll().size();
        criteriaPropery.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaProperyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, criteriaPropery.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(criteriaPropery))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCriteriaPropery() throws Exception {
        int databaseSizeBeforeUpdate = criteriaProperyRepository.findAll().size();
        criteriaPropery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaProperyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(criteriaPropery))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCriteriaPropery() throws Exception {
        int databaseSizeBeforeUpdate = criteriaProperyRepository.findAll().size();
        criteriaPropery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaProperyMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteriaPropery))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCriteriaProperyWithPatch() throws Exception {
        // Initialize the database
        criteriaProperyRepository.saveAndFlush(criteriaPropery);

        int databaseSizeBeforeUpdate = criteriaProperyRepository.findAll().size();

        // Update the criteriaPropery using partial update
        CriteriaPropery partialUpdatedCriteriaPropery = new CriteriaPropery();
        partialUpdatedCriteriaPropery.setId(criteriaPropery.getId());

        partialUpdatedCriteriaPropery.displayNameDe(UPDATED_DISPLAY_NAME_DE).displayNameIt(UPDATED_DISPLAY_NAME_IT);

        restCriteriaProperyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteriaPropery.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCriteriaPropery))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeUpdate);
        CriteriaPropery testCriteriaPropery = criteriaProperyList.get(criteriaProperyList.size() - 1);
        assertThat(testCriteriaPropery.getPropertyName()).isEqualTo(DEFAULT_PROPERTY_NAME);
        assertThat(testCriteriaPropery.getDisplayNameDe()).isEqualTo(UPDATED_DISPLAY_NAME_DE);
        assertThat(testCriteriaPropery.getDisplayNameEn()).isEqualTo(DEFAULT_DISPLAY_NAME_EN);
        assertThat(testCriteriaPropery.getDisplayNameFr()).isEqualTo(DEFAULT_DISPLAY_NAME_FR);
        assertThat(testCriteriaPropery.getDisplayNameIt()).isEqualTo(UPDATED_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void fullUpdateCriteriaProperyWithPatch() throws Exception {
        // Initialize the database
        criteriaProperyRepository.saveAndFlush(criteriaPropery);

        int databaseSizeBeforeUpdate = criteriaProperyRepository.findAll().size();

        // Update the criteriaPropery using partial update
        CriteriaPropery partialUpdatedCriteriaPropery = new CriteriaPropery();
        partialUpdatedCriteriaPropery.setId(criteriaPropery.getId());

        partialUpdatedCriteriaPropery
            .propertyName(UPDATED_PROPERTY_NAME)
            .displayNameDe(UPDATED_DISPLAY_NAME_DE)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR)
            .displayNameIt(UPDATED_DISPLAY_NAME_IT);

        restCriteriaProperyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteriaPropery.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCriteriaPropery))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeUpdate);
        CriteriaPropery testCriteriaPropery = criteriaProperyList.get(criteriaProperyList.size() - 1);
        assertThat(testCriteriaPropery.getPropertyName()).isEqualTo(UPDATED_PROPERTY_NAME);
        assertThat(testCriteriaPropery.getDisplayNameDe()).isEqualTo(UPDATED_DISPLAY_NAME_DE);
        assertThat(testCriteriaPropery.getDisplayNameEn()).isEqualTo(UPDATED_DISPLAY_NAME_EN);
        assertThat(testCriteriaPropery.getDisplayNameFr()).isEqualTo(UPDATED_DISPLAY_NAME_FR);
        assertThat(testCriteriaPropery.getDisplayNameIt()).isEqualTo(UPDATED_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void patchNonExistingCriteriaPropery() throws Exception {
        int databaseSizeBeforeUpdate = criteriaProperyRepository.findAll().size();
        criteriaPropery.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaProperyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, criteriaPropery.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteriaPropery))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCriteriaPropery() throws Exception {
        int databaseSizeBeforeUpdate = criteriaProperyRepository.findAll().size();
        criteriaPropery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaProperyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteriaPropery))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCriteriaPropery() throws Exception {
        int databaseSizeBeforeUpdate = criteriaProperyRepository.findAll().size();
        criteriaPropery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaProperyMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteriaPropery))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CriteriaPropery in the database
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCriteriaPropery() throws Exception {
        // Initialize the database
        criteriaProperyRepository.saveAndFlush(criteriaPropery);

        int databaseSizeBeforeDelete = criteriaProperyRepository.findAll().size();

        // Delete the criteriaPropery
        restCriteriaProperyMockMvc
            .perform(delete(ENTITY_API_URL_ID, criteriaPropery.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CriteriaPropery> criteriaProperyList = criteriaProperyRepository.findAll();
        assertThat(criteriaProperyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
