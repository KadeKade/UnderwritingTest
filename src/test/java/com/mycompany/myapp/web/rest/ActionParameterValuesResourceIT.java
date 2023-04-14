package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ActionParameterValues;
import com.mycompany.myapp.repository.ActionParameterValuesRepository;
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
 * Integration tests for the {@link ActionParameterValuesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActionParameterValuesResourceIT {

    private static final String DEFAULT_PARAMETER_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_PARAMETER_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/action-parameter-values";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActionParameterValuesRepository actionParameterValuesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActionParameterValuesMockMvc;

    private ActionParameterValues actionParameterValues;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionParameterValues createEntity(EntityManager em) {
        ActionParameterValues actionParameterValues = new ActionParameterValues().parameterValue(DEFAULT_PARAMETER_VALUE);
        return actionParameterValues;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionParameterValues createUpdatedEntity(EntityManager em) {
        ActionParameterValues actionParameterValues = new ActionParameterValues().parameterValue(UPDATED_PARAMETER_VALUE);
        return actionParameterValues;
    }

    @BeforeEach
    public void initTest() {
        actionParameterValues = createEntity(em);
    }

    @Test
    @Transactional
    void createActionParameterValues() throws Exception {
        int databaseSizeBeforeCreate = actionParameterValuesRepository.findAll().size();
        // Create the ActionParameterValues
        restActionParameterValuesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionParameterValues))
            )
            .andExpect(status().isCreated());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeCreate + 1);
        ActionParameterValues testActionParameterValues = actionParameterValuesList.get(actionParameterValuesList.size() - 1);
        assertThat(testActionParameterValues.getParameterValue()).isEqualTo(DEFAULT_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void createActionParameterValuesWithExistingId() throws Exception {
        // Create the ActionParameterValues with an existing ID
        actionParameterValues.setId(1L);

        int databaseSizeBeforeCreate = actionParameterValuesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActionParameterValuesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionParameterValues))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllActionParameterValues() throws Exception {
        // Initialize the database
        actionParameterValuesRepository.saveAndFlush(actionParameterValues);

        // Get all the actionParameterValuesList
        restActionParameterValuesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actionParameterValues.getId().intValue())))
            .andExpect(jsonPath("$.[*].parameterValue").value(hasItem(DEFAULT_PARAMETER_VALUE)));
    }

    @Test
    @Transactional
    void getActionParameterValues() throws Exception {
        // Initialize the database
        actionParameterValuesRepository.saveAndFlush(actionParameterValues);

        // Get the actionParameterValues
        restActionParameterValuesMockMvc
            .perform(get(ENTITY_API_URL_ID, actionParameterValues.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(actionParameterValues.getId().intValue()))
            .andExpect(jsonPath("$.parameterValue").value(DEFAULT_PARAMETER_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingActionParameterValues() throws Exception {
        // Get the actionParameterValues
        restActionParameterValuesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActionParameterValues() throws Exception {
        // Initialize the database
        actionParameterValuesRepository.saveAndFlush(actionParameterValues);

        int databaseSizeBeforeUpdate = actionParameterValuesRepository.findAll().size();

        // Update the actionParameterValues
        ActionParameterValues updatedActionParameterValues = actionParameterValuesRepository.findById(actionParameterValues.getId()).get();
        // Disconnect from session so that the updates on updatedActionParameterValues are not directly saved in db
        em.detach(updatedActionParameterValues);
        updatedActionParameterValues.parameterValue(UPDATED_PARAMETER_VALUE);

        restActionParameterValuesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActionParameterValues.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActionParameterValues))
            )
            .andExpect(status().isOk());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeUpdate);
        ActionParameterValues testActionParameterValues = actionParameterValuesList.get(actionParameterValuesList.size() - 1);
        assertThat(testActionParameterValues.getParameterValue()).isEqualTo(UPDATED_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingActionParameterValues() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterValuesRepository.findAll().size();
        actionParameterValues.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionParameterValuesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, actionParameterValues.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionParameterValues))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActionParameterValues() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterValuesRepository.findAll().size();
        actionParameterValues.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParameterValuesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionParameterValues))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActionParameterValues() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterValuesRepository.findAll().size();
        actionParameterValues.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParameterValuesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionParameterValues))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActionParameterValuesWithPatch() throws Exception {
        // Initialize the database
        actionParameterValuesRepository.saveAndFlush(actionParameterValues);

        int databaseSizeBeforeUpdate = actionParameterValuesRepository.findAll().size();

        // Update the actionParameterValues using partial update
        ActionParameterValues partialUpdatedActionParameterValues = new ActionParameterValues();
        partialUpdatedActionParameterValues.setId(actionParameterValues.getId());

        partialUpdatedActionParameterValues.parameterValue(UPDATED_PARAMETER_VALUE);

        restActionParameterValuesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActionParameterValues.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActionParameterValues))
            )
            .andExpect(status().isOk());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeUpdate);
        ActionParameterValues testActionParameterValues = actionParameterValuesList.get(actionParameterValuesList.size() - 1);
        assertThat(testActionParameterValues.getParameterValue()).isEqualTo(UPDATED_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateActionParameterValuesWithPatch() throws Exception {
        // Initialize the database
        actionParameterValuesRepository.saveAndFlush(actionParameterValues);

        int databaseSizeBeforeUpdate = actionParameterValuesRepository.findAll().size();

        // Update the actionParameterValues using partial update
        ActionParameterValues partialUpdatedActionParameterValues = new ActionParameterValues();
        partialUpdatedActionParameterValues.setId(actionParameterValues.getId());

        partialUpdatedActionParameterValues.parameterValue(UPDATED_PARAMETER_VALUE);

        restActionParameterValuesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActionParameterValues.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActionParameterValues))
            )
            .andExpect(status().isOk());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeUpdate);
        ActionParameterValues testActionParameterValues = actionParameterValuesList.get(actionParameterValuesList.size() - 1);
        assertThat(testActionParameterValues.getParameterValue()).isEqualTo(UPDATED_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingActionParameterValues() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterValuesRepository.findAll().size();
        actionParameterValues.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionParameterValuesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, actionParameterValues.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionParameterValues))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActionParameterValues() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterValuesRepository.findAll().size();
        actionParameterValues.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParameterValuesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionParameterValues))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActionParameterValues() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterValuesRepository.findAll().size();
        actionParameterValues.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParameterValuesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionParameterValues))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActionParameterValues in the database
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActionParameterValues() throws Exception {
        // Initialize the database
        actionParameterValuesRepository.saveAndFlush(actionParameterValues);

        int databaseSizeBeforeDelete = actionParameterValuesRepository.findAll().size();

        // Delete the actionParameterValues
        restActionParameterValuesMockMvc
            .perform(delete(ENTITY_API_URL_ID, actionParameterValues.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActionParameterValues> actionParameterValuesList = actionParameterValuesRepository.findAll();
        assertThat(actionParameterValuesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
