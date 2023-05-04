package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ActionParameter;
import com.mycompany.myapp.repository.ActionParameterRepository;
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
 * Integration tests for the {@link ActionParameterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActionParameterResourceIT {

    private static final String DEFAULT_PARAMETER_KEY = "AAAAAAAAAA";
    private static final String UPDATED_PARAMETER_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_PARAMETER_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_PARAMETER_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/action-parameters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActionParameterRepository actionParameterRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActionParameterMockMvc;

    private ActionParameter actionParameter;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionParameter createEntity(EntityManager em) {
        ActionParameter actionParameter = new ActionParameter().parameterKey(DEFAULT_PARAMETER_KEY).parameterValue(DEFAULT_PARAMETER_VALUE);
        return actionParameter;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionParameter createUpdatedEntity(EntityManager em) {
        ActionParameter actionParameter = new ActionParameter().parameterKey(UPDATED_PARAMETER_KEY).parameterValue(UPDATED_PARAMETER_VALUE);
        return actionParameter;
    }

    @BeforeEach
    public void initTest() {
        actionParameter = createEntity(em);
    }

    @Test
    @Transactional
    void createActionParameter() throws Exception {
        int databaseSizeBeforeCreate = actionParameterRepository.findAll().size();
        // Create the ActionParameter
        restActionParameterMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actionParameter))
            )
            .andExpect(status().isCreated());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeCreate + 1);
        ActionParameter testActionParameter = actionParameterList.get(actionParameterList.size() - 1);
        assertThat(testActionParameter.getParameterKey()).isEqualTo(DEFAULT_PARAMETER_KEY);
        assertThat(testActionParameter.getParameterValue()).isEqualTo(DEFAULT_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void createActionParameterWithExistingId() throws Exception {
        // Create the ActionParameter with an existing ID
        actionParameter.setId(1L);

        int databaseSizeBeforeCreate = actionParameterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActionParameterMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actionParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllActionParameters() throws Exception {
        // Initialize the database
        actionParameterRepository.saveAndFlush(actionParameter);

        // Get all the actionParameterList
        restActionParameterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actionParameter.getId().intValue())))
            .andExpect(jsonPath("$.[*].parameterKey").value(hasItem(DEFAULT_PARAMETER_KEY)))
            .andExpect(jsonPath("$.[*].parameterValue").value(hasItem(DEFAULT_PARAMETER_VALUE)));
    }

    @Test
    @Transactional
    void getActionParameter() throws Exception {
        // Initialize the database
        actionParameterRepository.saveAndFlush(actionParameter);

        // Get the actionParameter
        restActionParameterMockMvc
            .perform(get(ENTITY_API_URL_ID, actionParameter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(actionParameter.getId().intValue()))
            .andExpect(jsonPath("$.parameterKey").value(DEFAULT_PARAMETER_KEY))
            .andExpect(jsonPath("$.parameterValue").value(DEFAULT_PARAMETER_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingActionParameter() throws Exception {
        // Get the actionParameter
        restActionParameterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActionParameter() throws Exception {
        // Initialize the database
        actionParameterRepository.saveAndFlush(actionParameter);

        int databaseSizeBeforeUpdate = actionParameterRepository.findAll().size();

        // Update the actionParameter
        ActionParameter updatedActionParameter = actionParameterRepository.findById(actionParameter.getId()).get();
        // Disconnect from session so that the updates on updatedActionParameter are not directly saved in db
        em.detach(updatedActionParameter);
        updatedActionParameter.parameterKey(UPDATED_PARAMETER_KEY).parameterValue(UPDATED_PARAMETER_VALUE);

        restActionParameterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActionParameter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActionParameter))
            )
            .andExpect(status().isOk());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeUpdate);
        ActionParameter testActionParameter = actionParameterList.get(actionParameterList.size() - 1);
        assertThat(testActionParameter.getParameterKey()).isEqualTo(UPDATED_PARAMETER_KEY);
        assertThat(testActionParameter.getParameterValue()).isEqualTo(UPDATED_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingActionParameter() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterRepository.findAll().size();
        actionParameter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionParameterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, actionParameter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActionParameter() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterRepository.findAll().size();
        actionParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParameterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActionParameter() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterRepository.findAll().size();
        actionParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParameterMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actionParameter))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActionParameterWithPatch() throws Exception {
        // Initialize the database
        actionParameterRepository.saveAndFlush(actionParameter);

        int databaseSizeBeforeUpdate = actionParameterRepository.findAll().size();

        // Update the actionParameter using partial update
        ActionParameter partialUpdatedActionParameter = new ActionParameter();
        partialUpdatedActionParameter.setId(actionParameter.getId());

        partialUpdatedActionParameter.parameterKey(UPDATED_PARAMETER_KEY).parameterValue(UPDATED_PARAMETER_VALUE);

        restActionParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActionParameter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActionParameter))
            )
            .andExpect(status().isOk());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeUpdate);
        ActionParameter testActionParameter = actionParameterList.get(actionParameterList.size() - 1);
        assertThat(testActionParameter.getParameterKey()).isEqualTo(UPDATED_PARAMETER_KEY);
        assertThat(testActionParameter.getParameterValue()).isEqualTo(UPDATED_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateActionParameterWithPatch() throws Exception {
        // Initialize the database
        actionParameterRepository.saveAndFlush(actionParameter);

        int databaseSizeBeforeUpdate = actionParameterRepository.findAll().size();

        // Update the actionParameter using partial update
        ActionParameter partialUpdatedActionParameter = new ActionParameter();
        partialUpdatedActionParameter.setId(actionParameter.getId());

        partialUpdatedActionParameter.parameterKey(UPDATED_PARAMETER_KEY).parameterValue(UPDATED_PARAMETER_VALUE);

        restActionParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActionParameter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActionParameter))
            )
            .andExpect(status().isOk());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeUpdate);
        ActionParameter testActionParameter = actionParameterList.get(actionParameterList.size() - 1);
        assertThat(testActionParameter.getParameterKey()).isEqualTo(UPDATED_PARAMETER_KEY);
        assertThat(testActionParameter.getParameterValue()).isEqualTo(UPDATED_PARAMETER_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingActionParameter() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterRepository.findAll().size();
        actionParameter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, actionParameter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActionParameter() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterRepository.findAll().size();
        actionParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActionParameter() throws Exception {
        int databaseSizeBeforeUpdate = actionParameterRepository.findAll().size();
        actionParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParameterMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionParameter))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActionParameter in the database
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActionParameter() throws Exception {
        // Initialize the database
        actionParameterRepository.saveAndFlush(actionParameter);

        int databaseSizeBeforeDelete = actionParameterRepository.findAll().size();

        // Delete the actionParameter
        restActionParameterMockMvc
            .perform(delete(ENTITY_API_URL_ID, actionParameter.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActionParameter> actionParameterList = actionParameterRepository.findAll();
        assertThat(actionParameterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
