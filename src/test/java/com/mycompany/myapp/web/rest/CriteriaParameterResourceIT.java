package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CriteriaParameter;
import com.mycompany.myapp.repository.CriteriaParameterRepository;
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
 * Integration tests for the {@link CriteriaParameterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CriteriaParameterResourceIT {

    private static final String DEFAULT_PARAMETER_KEY = "AAAAAAAAAA";
    private static final String UPDATED_PARAMETER_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_PARAMETER_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_PARAMETER_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/criteria-parameters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CriteriaParameterRepository criteriaParameterRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCriteriaParameterMockMvc;

    private CriteriaParameter criteriaParameter;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CriteriaParameter createEntity(EntityManager em) {
        CriteriaParameter criteriaParameter = new CriteriaParameter()
            .parameterKey(DEFAULT_PARAMETER_KEY)
            .parameterValue(DEFAULT_PARAMETER_VALUE);
        return criteriaParameter;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CriteriaParameter createUpdatedEntity(EntityManager em) {
        CriteriaParameter criteriaParameter = new CriteriaParameter()
            .parameterKey(UPDATED_PARAMETER_KEY)
            .parameterValue(UPDATED_PARAMETER_VALUE);
        return criteriaParameter;
    }

    @BeforeEach
    public void initTest() {
        criteriaParameter = createEntity(em);
    }

    @Test
    @Transactional
    void createCriteriaParameter() throws Exception {
        int databaseSizeBeforeCreate = criteriaParameterRepository.findAll().size();
        // Create the CriteriaParameter
        restCriteriaParameterMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteriaParameter))
            )
            .andExpect(status().isCreated());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeCreate + 1);
        CriteriaParameter testCriteriaParameter = criteriaParameterList.get(criteriaParameterList.size() - 1);
        assertThat(testCriteriaParameter.getParameterKey()).isEqualTo(DEFAULT_PARAMETER_KEY);
        assertThat(testCriteriaParameter.getParameterValue()).isEqualTo(DEFAULT_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void createCriteriaParameterWithExistingId() throws Exception {
        // Create the CriteriaParameter with an existing ID
        criteriaParameter.setId(1L);

        int databaseSizeBeforeCreate = criteriaParameterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCriteriaParameterMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteriaParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCriteriaParameters() throws Exception {
        // Initialize the database
        criteriaParameterRepository.saveAndFlush(criteriaParameter);

        // Get all the criteriaParameterList
        restCriteriaParameterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(criteriaParameter.getId().intValue())))
            .andExpect(jsonPath("$.[*].parameterKey").value(hasItem(DEFAULT_PARAMETER_KEY)))
            .andExpect(jsonPath("$.[*].parameterValue").value(hasItem(DEFAULT_PARAMETER_VALUE)));
    }

    @Test
    @Transactional
    void getCriteriaParameter() throws Exception {
        // Initialize the database
        criteriaParameterRepository.saveAndFlush(criteriaParameter);

        // Get the criteriaParameter
        restCriteriaParameterMockMvc
            .perform(get(ENTITY_API_URL_ID, criteriaParameter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(criteriaParameter.getId().intValue()))
            .andExpect(jsonPath("$.parameterKey").value(DEFAULT_PARAMETER_KEY))
            .andExpect(jsonPath("$.parameterValue").value(DEFAULT_PARAMETER_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingCriteriaParameter() throws Exception {
        // Get the criteriaParameter
        restCriteriaParameterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCriteriaParameter() throws Exception {
        // Initialize the database
        criteriaParameterRepository.saveAndFlush(criteriaParameter);

        int databaseSizeBeforeUpdate = criteriaParameterRepository.findAll().size();

        // Update the criteriaParameter
        CriteriaParameter updatedCriteriaParameter = criteriaParameterRepository.findById(criteriaParameter.getId()).get();
        // Disconnect from session so that the updates on updatedCriteriaParameter are not directly saved in db
        em.detach(updatedCriteriaParameter);
        updatedCriteriaParameter.parameterKey(UPDATED_PARAMETER_KEY).parameterValue(UPDATED_PARAMETER_VALUE);

        restCriteriaParameterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCriteriaParameter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCriteriaParameter))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeUpdate);
        CriteriaParameter testCriteriaParameter = criteriaParameterList.get(criteriaParameterList.size() - 1);
        assertThat(testCriteriaParameter.getParameterKey()).isEqualTo(UPDATED_PARAMETER_KEY);
        assertThat(testCriteriaParameter.getParameterValue()).isEqualTo(UPDATED_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingCriteriaParameter() throws Exception {
        int databaseSizeBeforeUpdate = criteriaParameterRepository.findAll().size();
        criteriaParameter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaParameterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, criteriaParameter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(criteriaParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCriteriaParameter() throws Exception {
        int databaseSizeBeforeUpdate = criteriaParameterRepository.findAll().size();
        criteriaParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaParameterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(criteriaParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCriteriaParameter() throws Exception {
        int databaseSizeBeforeUpdate = criteriaParameterRepository.findAll().size();
        criteriaParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaParameterMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteriaParameter))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCriteriaParameterWithPatch() throws Exception {
        // Initialize the database
        criteriaParameterRepository.saveAndFlush(criteriaParameter);

        int databaseSizeBeforeUpdate = criteriaParameterRepository.findAll().size();

        // Update the criteriaParameter using partial update
        CriteriaParameter partialUpdatedCriteriaParameter = new CriteriaParameter();
        partialUpdatedCriteriaParameter.setId(criteriaParameter.getId());

        partialUpdatedCriteriaParameter.parameterKey(UPDATED_PARAMETER_KEY);

        restCriteriaParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteriaParameter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCriteriaParameter))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeUpdate);
        CriteriaParameter testCriteriaParameter = criteriaParameterList.get(criteriaParameterList.size() - 1);
        assertThat(testCriteriaParameter.getParameterKey()).isEqualTo(UPDATED_PARAMETER_KEY);
        assertThat(testCriteriaParameter.getParameterValue()).isEqualTo(DEFAULT_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateCriteriaParameterWithPatch() throws Exception {
        // Initialize the database
        criteriaParameterRepository.saveAndFlush(criteriaParameter);

        int databaseSizeBeforeUpdate = criteriaParameterRepository.findAll().size();

        // Update the criteriaParameter using partial update
        CriteriaParameter partialUpdatedCriteriaParameter = new CriteriaParameter();
        partialUpdatedCriteriaParameter.setId(criteriaParameter.getId());

        partialUpdatedCriteriaParameter.parameterKey(UPDATED_PARAMETER_KEY).parameterValue(UPDATED_PARAMETER_VALUE);

        restCriteriaParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteriaParameter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCriteriaParameter))
            )
            .andExpect(status().isOk());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeUpdate);
        CriteriaParameter testCriteriaParameter = criteriaParameterList.get(criteriaParameterList.size() - 1);
        assertThat(testCriteriaParameter.getParameterKey()).isEqualTo(UPDATED_PARAMETER_KEY);
        assertThat(testCriteriaParameter.getParameterValue()).isEqualTo(UPDATED_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingCriteriaParameter() throws Exception {
        int databaseSizeBeforeUpdate = criteriaParameterRepository.findAll().size();
        criteriaParameter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, criteriaParameter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteriaParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCriteriaParameter() throws Exception {
        int databaseSizeBeforeUpdate = criteriaParameterRepository.findAll().size();
        criteriaParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteriaParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCriteriaParameter() throws Exception {
        int databaseSizeBeforeUpdate = criteriaParameterRepository.findAll().size();
        criteriaParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaParameterMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteriaParameter))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CriteriaParameter in the database
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCriteriaParameter() throws Exception {
        // Initialize the database
        criteriaParameterRepository.saveAndFlush(criteriaParameter);

        int databaseSizeBeforeDelete = criteriaParameterRepository.findAll().size();

        // Delete the criteriaParameter
        restCriteriaParameterMockMvc
            .perform(delete(ENTITY_API_URL_ID, criteriaParameter.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CriteriaParameter> criteriaParameterList = criteriaParameterRepository.findAll();
        assertThat(criteriaParameterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
