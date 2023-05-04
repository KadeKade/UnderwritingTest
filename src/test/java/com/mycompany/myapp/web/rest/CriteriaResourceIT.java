package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Criteria;
import com.mycompany.myapp.domain.enumeration.CriteriaDefinition;
import com.mycompany.myapp.domain.enumeration.CriteriaType;
import com.mycompany.myapp.domain.enumeration.Operator;
import com.mycompany.myapp.repository.CriteriaRepository;
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
 * Integration tests for the {@link CriteriaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CriteriaResourceIT {

    private static final Integer DEFAULT_PRIORITY = 1;
    private static final Integer UPDATED_PRIORITY = 2;

    private static final CriteriaType DEFAULT_CRITERIA_ACTION_TYPE = CriteriaType.POSITIVE;
    private static final CriteriaType UPDATED_CRITERIA_ACTION_TYPE = CriteriaType.NEGATIVE;

    private static final Operator DEFAULT_OPERATOR = Operator.NOT_EQUAL_TO;
    private static final Operator UPDATED_OPERATOR = Operator.EQUAL_TO;

    private static final CriteriaDefinition DEFAULT_CRITERIA_DEFINITION = CriteriaDefinition.CREDITWORTHINESS;
    private static final CriteriaDefinition UPDATED_CRITERIA_DEFINITION = CriteriaDefinition.SALARY_SUMM;

    private static final String ENTITY_API_URL = "/api/criteria";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCriteriaMockMvc;

    private Criteria criteria;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Criteria createEntity(EntityManager em) {
        Criteria criteria = new Criteria()
            .priority(DEFAULT_PRIORITY)
            .criteriaActionType(DEFAULT_CRITERIA_ACTION_TYPE)
            .operator(DEFAULT_OPERATOR)
            .criteriaDefinition(DEFAULT_CRITERIA_DEFINITION);
        return criteria;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Criteria createUpdatedEntity(EntityManager em) {
        Criteria criteria = new Criteria()
            .priority(UPDATED_PRIORITY)
            .criteriaActionType(UPDATED_CRITERIA_ACTION_TYPE)
            .operator(UPDATED_OPERATOR)
            .criteriaDefinition(UPDATED_CRITERIA_DEFINITION);
        return criteria;
    }

    @BeforeEach
    public void initTest() {
        criteria = createEntity(em);
    }

    @Test
    @Transactional
    void createCriteria() throws Exception {
        int databaseSizeBeforeCreate = criteriaRepository.findAll().size();
        // Create the Criteria
        restCriteriaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteria)))
            .andExpect(status().isCreated());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeCreate + 1);
        Criteria testCriteria = criteriaList.get(criteriaList.size() - 1);
        assertThat(testCriteria.getPriority()).isEqualTo(DEFAULT_PRIORITY);
        assertThat(testCriteria.getCriteriaActionType()).isEqualTo(DEFAULT_CRITERIA_ACTION_TYPE);
        assertThat(testCriteria.getOperator()).isEqualTo(DEFAULT_OPERATOR);
        assertThat(testCriteria.getCriteriaDefinition()).isEqualTo(DEFAULT_CRITERIA_DEFINITION);
    }

    @Test
    @Transactional
    void createCriteriaWithExistingId() throws Exception {
        // Create the Criteria with an existing ID
        criteria.setId(1L);

        int databaseSizeBeforeCreate = criteriaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCriteriaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteria)))
            .andExpect(status().isBadRequest());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCriteria() throws Exception {
        // Initialize the database
        criteriaRepository.saveAndFlush(criteria);

        // Get all the criteriaList
        restCriteriaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(criteria.getId().intValue())))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY)))
            .andExpect(jsonPath("$.[*].criteriaActionType").value(hasItem(DEFAULT_CRITERIA_ACTION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].operator").value(hasItem(DEFAULT_OPERATOR.toString())))
            .andExpect(jsonPath("$.[*].criteriaDefinition").value(hasItem(DEFAULT_CRITERIA_DEFINITION.toString())));
    }

    @Test
    @Transactional
    void getCriteria() throws Exception {
        // Initialize the database
        criteriaRepository.saveAndFlush(criteria);

        // Get the criteria
        restCriteriaMockMvc
            .perform(get(ENTITY_API_URL_ID, criteria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(criteria.getId().intValue()))
            .andExpect(jsonPath("$.priority").value(DEFAULT_PRIORITY))
            .andExpect(jsonPath("$.criteriaActionType").value(DEFAULT_CRITERIA_ACTION_TYPE.toString()))
            .andExpect(jsonPath("$.operator").value(DEFAULT_OPERATOR.toString()))
            .andExpect(jsonPath("$.criteriaDefinition").value(DEFAULT_CRITERIA_DEFINITION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCriteria() throws Exception {
        // Get the criteria
        restCriteriaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCriteria() throws Exception {
        // Initialize the database
        criteriaRepository.saveAndFlush(criteria);

        int databaseSizeBeforeUpdate = criteriaRepository.findAll().size();

        // Update the criteria
        Criteria updatedCriteria = criteriaRepository.findById(criteria.getId()).get();
        // Disconnect from session so that the updates on updatedCriteria are not directly saved in db
        em.detach(updatedCriteria);
        updatedCriteria
            .priority(UPDATED_PRIORITY)
            .criteriaActionType(UPDATED_CRITERIA_ACTION_TYPE)
            .operator(UPDATED_OPERATOR)
            .criteriaDefinition(UPDATED_CRITERIA_DEFINITION);

        restCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCriteria.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCriteria))
            )
            .andExpect(status().isOk());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeUpdate);
        Criteria testCriteria = criteriaList.get(criteriaList.size() - 1);
        assertThat(testCriteria.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testCriteria.getCriteriaActionType()).isEqualTo(UPDATED_CRITERIA_ACTION_TYPE);
        assertThat(testCriteria.getOperator()).isEqualTo(UPDATED_OPERATOR);
        assertThat(testCriteria.getCriteriaDefinition()).isEqualTo(UPDATED_CRITERIA_DEFINITION);
    }

    @Test
    @Transactional
    void putNonExistingCriteria() throws Exception {
        int databaseSizeBeforeUpdate = criteriaRepository.findAll().size();
        criteria.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, criteria.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(criteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCriteria() throws Exception {
        int databaseSizeBeforeUpdate = criteriaRepository.findAll().size();
        criteria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(criteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCriteria() throws Exception {
        int databaseSizeBeforeUpdate = criteriaRepository.findAll().size();
        criteria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(criteria)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCriteriaWithPatch() throws Exception {
        // Initialize the database
        criteriaRepository.saveAndFlush(criteria);

        int databaseSizeBeforeUpdate = criteriaRepository.findAll().size();

        // Update the criteria using partial update
        Criteria partialUpdatedCriteria = new Criteria();
        partialUpdatedCriteria.setId(criteria.getId());

        partialUpdatedCriteria.priority(UPDATED_PRIORITY).operator(UPDATED_OPERATOR);

        restCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCriteria))
            )
            .andExpect(status().isOk());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeUpdate);
        Criteria testCriteria = criteriaList.get(criteriaList.size() - 1);
        assertThat(testCriteria.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testCriteria.getCriteriaActionType()).isEqualTo(DEFAULT_CRITERIA_ACTION_TYPE);
        assertThat(testCriteria.getOperator()).isEqualTo(UPDATED_OPERATOR);
        assertThat(testCriteria.getCriteriaDefinition()).isEqualTo(DEFAULT_CRITERIA_DEFINITION);
    }

    @Test
    @Transactional
    void fullUpdateCriteriaWithPatch() throws Exception {
        // Initialize the database
        criteriaRepository.saveAndFlush(criteria);

        int databaseSizeBeforeUpdate = criteriaRepository.findAll().size();

        // Update the criteria using partial update
        Criteria partialUpdatedCriteria = new Criteria();
        partialUpdatedCriteria.setId(criteria.getId());

        partialUpdatedCriteria
            .priority(UPDATED_PRIORITY)
            .criteriaActionType(UPDATED_CRITERIA_ACTION_TYPE)
            .operator(UPDATED_OPERATOR)
            .criteriaDefinition(UPDATED_CRITERIA_DEFINITION);

        restCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCriteria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCriteria))
            )
            .andExpect(status().isOk());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeUpdate);
        Criteria testCriteria = criteriaList.get(criteriaList.size() - 1);
        assertThat(testCriteria.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testCriteria.getCriteriaActionType()).isEqualTo(UPDATED_CRITERIA_ACTION_TYPE);
        assertThat(testCriteria.getOperator()).isEqualTo(UPDATED_OPERATOR);
        assertThat(testCriteria.getCriteriaDefinition()).isEqualTo(UPDATED_CRITERIA_DEFINITION);
    }

    @Test
    @Transactional
    void patchNonExistingCriteria() throws Exception {
        int databaseSizeBeforeUpdate = criteriaRepository.findAll().size();
        criteria.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, criteria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCriteria() throws Exception {
        int databaseSizeBeforeUpdate = criteriaRepository.findAll().size();
        criteria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(criteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCriteria() throws Exception {
        int databaseSizeBeforeUpdate = criteriaRepository.findAll().size();
        criteria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCriteriaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(criteria)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Criteria in the database
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCriteria() throws Exception {
        // Initialize the database
        criteriaRepository.saveAndFlush(criteria);

        int databaseSizeBeforeDelete = criteriaRepository.findAll().size();

        // Delete the criteria
        restCriteriaMockMvc
            .perform(delete(ENTITY_API_URL_ID, criteria.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Criteria> criteriaList = criteriaRepository.findAll();
        assertThat(criteriaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
