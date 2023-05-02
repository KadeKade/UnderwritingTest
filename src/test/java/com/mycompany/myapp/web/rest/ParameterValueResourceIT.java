package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ParameterValue;
import com.mycompany.myapp.repository.ParameterValueRepository;
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
 * Integration tests for the {@link ParameterValueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ParameterValueResourceIT {

    private static final String DEFAULT_ACTION_PARAMETER_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_ACTION_PARAMETER_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/parameter-values";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParameterValueRepository parameterValueRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restParameterValueMockMvc;

    private ParameterValue parameterValue;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParameterValue createEntity(EntityManager em) {
        ParameterValue parameterValue = new ParameterValue().actionParameterValue(DEFAULT_ACTION_PARAMETER_VALUE);
        return parameterValue;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParameterValue createUpdatedEntity(EntityManager em) {
        ParameterValue parameterValue = new ParameterValue().actionParameterValue(UPDATED_ACTION_PARAMETER_VALUE);
        return parameterValue;
    }

    @BeforeEach
    public void initTest() {
        parameterValue = createEntity(em);
    }

    @Test
    @Transactional
    void createParameterValue() throws Exception {
        int databaseSizeBeforeCreate = parameterValueRepository.findAll().size();
        // Create the ParameterValue
        restParameterValueMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parameterValue))
            )
            .andExpect(status().isCreated());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeCreate + 1);
        ParameterValue testParameterValue = parameterValueList.get(parameterValueList.size() - 1);
        assertThat(testParameterValue.getActionParameterValue()).isEqualTo(DEFAULT_ACTION_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void createParameterValueWithExistingId() throws Exception {
        // Create the ParameterValue with an existing ID
        parameterValue.setId(1L);

        int databaseSizeBeforeCreate = parameterValueRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restParameterValueMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parameterValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllParameterValues() throws Exception {
        // Initialize the database
        parameterValueRepository.saveAndFlush(parameterValue);

        // Get all the parameterValueList
        restParameterValueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parameterValue.getId().intValue())))
            .andExpect(jsonPath("$.[*].actionParameterValue").value(hasItem(DEFAULT_ACTION_PARAMETER_VALUE)));
    }

    @Test
    @Transactional
    void getParameterValue() throws Exception {
        // Initialize the database
        parameterValueRepository.saveAndFlush(parameterValue);

        // Get the parameterValue
        restParameterValueMockMvc
            .perform(get(ENTITY_API_URL_ID, parameterValue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(parameterValue.getId().intValue()))
            .andExpect(jsonPath("$.actionParameterValue").value(DEFAULT_ACTION_PARAMETER_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingParameterValue() throws Exception {
        // Get the parameterValue
        restParameterValueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingParameterValue() throws Exception {
        // Initialize the database
        parameterValueRepository.saveAndFlush(parameterValue);

        int databaseSizeBeforeUpdate = parameterValueRepository.findAll().size();

        // Update the parameterValue
        ParameterValue updatedParameterValue = parameterValueRepository.findById(parameterValue.getId()).get();
        // Disconnect from session so that the updates on updatedParameterValue are not directly saved in db
        em.detach(updatedParameterValue);
        updatedParameterValue.actionParameterValue(UPDATED_ACTION_PARAMETER_VALUE);

        restParameterValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParameterValue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedParameterValue))
            )
            .andExpect(status().isOk());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeUpdate);
        ParameterValue testParameterValue = parameterValueList.get(parameterValueList.size() - 1);
        assertThat(testParameterValue.getActionParameterValue()).isEqualTo(UPDATED_ACTION_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingParameterValue() throws Exception {
        int databaseSizeBeforeUpdate = parameterValueRepository.findAll().size();
        parameterValue.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParameterValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, parameterValue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parameterValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParameterValue() throws Exception {
        int databaseSizeBeforeUpdate = parameterValueRepository.findAll().size();
        parameterValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParameterValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parameterValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParameterValue() throws Exception {
        int databaseSizeBeforeUpdate = parameterValueRepository.findAll().size();
        parameterValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParameterValueMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parameterValue)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateParameterValueWithPatch() throws Exception {
        // Initialize the database
        parameterValueRepository.saveAndFlush(parameterValue);

        int databaseSizeBeforeUpdate = parameterValueRepository.findAll().size();

        // Update the parameterValue using partial update
        ParameterValue partialUpdatedParameterValue = new ParameterValue();
        partialUpdatedParameterValue.setId(parameterValue.getId());

        partialUpdatedParameterValue.actionParameterValue(UPDATED_ACTION_PARAMETER_VALUE);

        restParameterValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParameterValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParameterValue))
            )
            .andExpect(status().isOk());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeUpdate);
        ParameterValue testParameterValue = parameterValueList.get(parameterValueList.size() - 1);
        assertThat(testParameterValue.getActionParameterValue()).isEqualTo(UPDATED_ACTION_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateParameterValueWithPatch() throws Exception {
        // Initialize the database
        parameterValueRepository.saveAndFlush(parameterValue);

        int databaseSizeBeforeUpdate = parameterValueRepository.findAll().size();

        // Update the parameterValue using partial update
        ParameterValue partialUpdatedParameterValue = new ParameterValue();
        partialUpdatedParameterValue.setId(parameterValue.getId());

        partialUpdatedParameterValue.actionParameterValue(UPDATED_ACTION_PARAMETER_VALUE);

        restParameterValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParameterValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParameterValue))
            )
            .andExpect(status().isOk());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeUpdate);
        ParameterValue testParameterValue = parameterValueList.get(parameterValueList.size() - 1);
        assertThat(testParameterValue.getActionParameterValue()).isEqualTo(UPDATED_ACTION_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingParameterValue() throws Exception {
        int databaseSizeBeforeUpdate = parameterValueRepository.findAll().size();
        parameterValue.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParameterValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, parameterValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parameterValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParameterValue() throws Exception {
        int databaseSizeBeforeUpdate = parameterValueRepository.findAll().size();
        parameterValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParameterValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parameterValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParameterValue() throws Exception {
        int databaseSizeBeforeUpdate = parameterValueRepository.findAll().size();
        parameterValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParameterValueMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(parameterValue))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParameterValue in the database
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParameterValue() throws Exception {
        // Initialize the database
        parameterValueRepository.saveAndFlush(parameterValue);

        int databaseSizeBeforeDelete = parameterValueRepository.findAll().size();

        // Delete the parameterValue
        restParameterValueMockMvc
            .perform(delete(ENTITY_API_URL_ID, parameterValue.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ParameterValue> parameterValueList = parameterValueRepository.findAll();
        assertThat(parameterValueList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
