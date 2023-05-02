package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CriteriaProperty;
import com.mycompany.myapp.domain.enumeration.DataType;
import com.mycompany.myapp.repository.CriteriaPropertyRepository;
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
 * Integration tests for the {@link CriteriaPropertyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CriteriaPropertyResourceIT {

    private static final String DEFAULT_PROPERTY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PROPERTY_NAME = "BBBBBBBBBB";

    private static final DataType DEFAULT_PROPERTY_TYPE = DataType.STRING;
    private static final DataType UPDATED_PROPERTY_TYPE = DataType.LIST_OF_STRINGS;

    private static final String DEFAULT_DISPLAY_NAME_DE = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_DE = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_EN = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_EN = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_FR = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_FR = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_IT = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_IT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/criteria-properties";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CriteriaPropertyRepository criteriaPropertyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCriteriaPropertyMockMvc;

    private CriteriaProperty criteriaProperty;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CriteriaProperty createEntity(EntityManager em) {
        CriteriaProperty criteriaProperty = new CriteriaProperty()
            .propertyName(DEFAULT_PROPERTY_NAME)
            .propertyType(DEFAULT_PROPERTY_TYPE)
            .displayNameDe(DEFAULT_DISPLAY_NAME_DE)
            .displayNameEn(DEFAULT_DISPLAY_NAME_EN)
            .displayNameFr(DEFAULT_DISPLAY_NAME_FR)
            .displayNameIt(DEFAULT_DISPLAY_NAME_IT);
        return criteriaProperty;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CriteriaProperty createUpdatedEntity(EntityManager em) {
        CriteriaProperty criteriaProperty = new CriteriaProperty()
            .propertyName(UPDATED_PROPERTY_NAME)
            .propertyType(UPDATED_PROPERTY_TYPE)
            .displayNameDe(UPDATED_DISPLAY_NAME_DE)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR)
            .displayNameIt(UPDATED_DISPLAY_NAME_IT);
        return criteriaProperty;
    }

    @BeforeEach
    public void initTest() {
        criteriaProperty = createEntity(em);
    }

    @Test
    @Transactional
    void createCriteriaProperty() throws Exception {
        int databaseSizeBeforeCreate = criteriaPropertyRepository.findAll().size();
        // Create the CriteriaProperty
        restCriteriaPropertyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteriaProperty))
            )
            .andExpect(status().isCreated());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeCreate + 1);
        CriteriaProperty testCriteriaProperty = criteriaPropertyList.get(criteriaPropertyList.size() - 1);
        assertThat(testCriteriaProperty.getPropertyName()).isEqualTo(DEFAULT_PROPERTY_NAME);
        assertThat(testCriteriaProperty.getPropertyType()).isEqualTo(DEFAULT_PROPERTY_TYPE);
        assertThat(testCriteriaProperty.getDisplayNameDe()).isEqualTo(DEFAULT_DISPLAY_NAME_DE);
        assertThat(testCriteriaProperty.getDisplayNameEn()).isEqualTo(DEFAULT_DISPLAY_NAME_EN);
        assertThat(testCriteriaProperty.getDisplayNameFr()).isEqualTo(DEFAULT_DISPLAY_NAME_FR);
        assertThat(testCriteriaProperty.getDisplayNameIt()).isEqualTo(DEFAULT_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void createCriteriaPropertyWithExistingId() throws Exception {
        // Create the CriteriaProperty with an existing ID
        criteriaProperty.setId(1L);

        int databaseSizeBeforeCreate = criteriaPropertyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCriteriaPropertyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteriaProperty))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCriteriaProperties() throws Exception {
        // Initialize the database
        criteriaPropertyRepository.saveAndFlush(criteriaProperty);

        // Get all the criteriaPropertyList
        restCriteriaPropertyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(criteriaProperty.getId().intValue())))
            .andExpect(jsonPath("$.[*].propertyName").value(hasItem(DEFAULT_PROPERTY_NAME)))
            .andExpect(jsonPath("$.[*].propertyType").value(hasItem(DEFAULT_PROPERTY_TYPE.toString())))
            .andExpect(jsonPath("$.[*].displayNameDe").value(hasItem(DEFAULT_DISPLAY_NAME_DE)))
            .andExpect(jsonPath("$.[*].displayNameEn").value(hasItem(DEFAULT_DISPLAY_NAME_EN)))
            .andExpect(jsonPath("$.[*].displayNameFr").value(hasItem(DEFAULT_DISPLAY_NAME_FR)))
            .andExpect(jsonPath("$.[*].displayNameIt").value(hasItem(DEFAULT_DISPLAY_NAME_IT)));
    }

    @Test
    @Transactional
    void getCriteriaProperty() throws Exception {
        // Initialize the database
        criteriaPropertyRepository.saveAndFlush(criteriaProperty);

        // Get the criteriaProperty
        restCriteriaPropertyMockMvc
            .perform(get(ENTITY_API_URL_ID, criteriaProperty.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(criteriaProperty.getId().intValue()))
            .andExpect(jsonPath("$.propertyName").value(DEFAULT_PROPERTY_NAME))
            .andExpect(jsonPath("$.propertyType").value(DEFAULT_PROPERTY_TYPE.toString()))
            .andExpect(jsonPath("$.displayNameDe").value(DEFAULT_DISPLAY_NAME_DE))
            .andExpect(jsonPath("$.displayNameEn").value(DEFAULT_DISPLAY_NAME_EN))
            .andExpect(jsonPath("$.displayNameFr").value(DEFAULT_DISPLAY_NAME_FR))
            .andExpect(jsonPath("$.displayNameIt").value(DEFAULT_DISPLAY_NAME_IT));
    }

    @Test
    @Transactional
    void getNonExistingCriteriaProperty() throws Exception {
        // Get the criteriaProperty
        restCriteriaPropertyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCriteriaProperty() throws Exception {
        // Initialize the database
        criteriaPropertyRepository.saveAndFlush(criteriaProperty);

        int databaseSizeBeforeUpdate = criteriaPropertyRepository.findAll().size();

        // Update the criteriaProperty
        CriteriaProperty updatedCriteriaProperty = criteriaPropertyRepository.findById(criteriaProperty.getId()).get();
        // Disconnect from session so that the updates on updatedCriteriaProperty are not directly saved in db
        em.detach(updatedCriteriaProperty);
        updatedCriteriaProperty
            .propertyName(UPDATED_PROPERTY_NAME)
            .propertyType(UPDATED_PROPERTY_TYPE)
            .displayNameDe(UPDATED_DISPLAY_NAME_DE)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR)
            .displayNameIt(UPDATED_DISPLAY_NAME_IT);

        restCriteriaPropertyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCriteriaProperty.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCriteriaProperty))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeUpdate);
        CriteriaProperty testCriteriaProperty = criteriaPropertyList.get(criteriaPropertyList.size() - 1);
        assertThat(testCriteriaProperty.getPropertyName()).isEqualTo(UPDATED_PROPERTY_NAME);
        assertThat(testCriteriaProperty.getPropertyType()).isEqualTo(UPDATED_PROPERTY_TYPE);
        assertThat(testCriteriaProperty.getDisplayNameDe()).isEqualTo(UPDATED_DISPLAY_NAME_DE);
        assertThat(testCriteriaProperty.getDisplayNameEn()).isEqualTo(UPDATED_DISPLAY_NAME_EN);
        assertThat(testCriteriaProperty.getDisplayNameFr()).isEqualTo(UPDATED_DISPLAY_NAME_FR);
        assertThat(testCriteriaProperty.getDisplayNameIt()).isEqualTo(UPDATED_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void putNonExistingCriteriaProperty() throws Exception {
        int databaseSizeBeforeUpdate = criteriaPropertyRepository.findAll().size();
        criteriaProperty.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaPropertyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, criteriaProperty.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(criteriaProperty))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCriteriaProperty() throws Exception {
        int databaseSizeBeforeUpdate = criteriaPropertyRepository.findAll().size();
        criteriaProperty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaPropertyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(criteriaProperty))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCriteriaProperty() throws Exception {
        int databaseSizeBeforeUpdate = criteriaPropertyRepository.findAll().size();
        criteriaProperty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaPropertyMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteriaProperty))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCriteriaPropertyWithPatch() throws Exception {
        // Initialize the database
        criteriaPropertyRepository.saveAndFlush(criteriaProperty);

        int databaseSizeBeforeUpdate = criteriaPropertyRepository.findAll().size();

        // Update the criteriaProperty using partial update
        CriteriaProperty partialUpdatedCriteriaProperty = new CriteriaProperty();
        partialUpdatedCriteriaProperty.setId(criteriaProperty.getId());

        partialUpdatedCriteriaProperty
            .propertyName(UPDATED_PROPERTY_NAME)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR);

        restCriteriaPropertyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteriaProperty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCriteriaProperty))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeUpdate);
        CriteriaProperty testCriteriaProperty = criteriaPropertyList.get(criteriaPropertyList.size() - 1);
        assertThat(testCriteriaProperty.getPropertyName()).isEqualTo(UPDATED_PROPERTY_NAME);
        assertThat(testCriteriaProperty.getPropertyType()).isEqualTo(DEFAULT_PROPERTY_TYPE);
        assertThat(testCriteriaProperty.getDisplayNameDe()).isEqualTo(DEFAULT_DISPLAY_NAME_DE);
        assertThat(testCriteriaProperty.getDisplayNameEn()).isEqualTo(UPDATED_DISPLAY_NAME_EN);
        assertThat(testCriteriaProperty.getDisplayNameFr()).isEqualTo(UPDATED_DISPLAY_NAME_FR);
        assertThat(testCriteriaProperty.getDisplayNameIt()).isEqualTo(DEFAULT_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void fullUpdateCriteriaPropertyWithPatch() throws Exception {
        // Initialize the database
        criteriaPropertyRepository.saveAndFlush(criteriaProperty);

        int databaseSizeBeforeUpdate = criteriaPropertyRepository.findAll().size();

        // Update the criteriaProperty using partial update
        CriteriaProperty partialUpdatedCriteriaProperty = new CriteriaProperty();
        partialUpdatedCriteriaProperty.setId(criteriaProperty.getId());

        partialUpdatedCriteriaProperty
            .propertyName(UPDATED_PROPERTY_NAME)
            .propertyType(UPDATED_PROPERTY_TYPE)
            .displayNameDe(UPDATED_DISPLAY_NAME_DE)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR)
            .displayNameIt(UPDATED_DISPLAY_NAME_IT);

        restCriteriaPropertyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteriaProperty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCriteriaProperty))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeUpdate);
        CriteriaProperty testCriteriaProperty = criteriaPropertyList.get(criteriaPropertyList.size() - 1);
        assertThat(testCriteriaProperty.getPropertyName()).isEqualTo(UPDATED_PROPERTY_NAME);
        assertThat(testCriteriaProperty.getPropertyType()).isEqualTo(UPDATED_PROPERTY_TYPE);
        assertThat(testCriteriaProperty.getDisplayNameDe()).isEqualTo(UPDATED_DISPLAY_NAME_DE);
        assertThat(testCriteriaProperty.getDisplayNameEn()).isEqualTo(UPDATED_DISPLAY_NAME_EN);
        assertThat(testCriteriaProperty.getDisplayNameFr()).isEqualTo(UPDATED_DISPLAY_NAME_FR);
        assertThat(testCriteriaProperty.getDisplayNameIt()).isEqualTo(UPDATED_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void patchNonExistingCriteriaProperty() throws Exception {
        int databaseSizeBeforeUpdate = criteriaPropertyRepository.findAll().size();
        criteriaProperty.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaPropertyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, criteriaProperty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteriaProperty))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCriteriaProperty() throws Exception {
        int databaseSizeBeforeUpdate = criteriaPropertyRepository.findAll().size();
        criteriaProperty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaPropertyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteriaProperty))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCriteriaProperty() throws Exception {
        int databaseSizeBeforeUpdate = criteriaPropertyRepository.findAll().size();
        criteriaProperty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaPropertyMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteriaProperty))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CriteriaProperty in the database
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCriteriaProperty() throws Exception {
        // Initialize the database
        criteriaPropertyRepository.saveAndFlush(criteriaProperty);

        int databaseSizeBeforeDelete = criteriaPropertyRepository.findAll().size();

        // Delete the criteriaProperty
        restCriteriaPropertyMockMvc
            .perform(delete(ENTITY_API_URL_ID, criteriaProperty.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CriteriaProperty> criteriaPropertyList = criteriaPropertyRepository.findAll();
        assertThat(criteriaPropertyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
