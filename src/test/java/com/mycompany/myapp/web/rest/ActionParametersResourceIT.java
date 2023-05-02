package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ActionParameters;
import com.mycompany.myapp.repository.ActionParametersRepository;
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
 * Integration tests for the {@link ActionParametersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActionParametersResourceIT {

    private static final String DEFAULT_PARAMETER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PARAMETER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_DE = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_DE = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_EN = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_EN = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_FR = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_FR = "BBBBBBBBBB";

    private static final String DEFAULT_DISPLAY_NAME_IT = "AAAAAAAAAA";
    private static final String UPDATED_DISPLAY_NAME_IT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/action-parameters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActionParametersRepository actionParametersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActionParametersMockMvc;

    private ActionParameters actionParameters;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionParameters createEntity(EntityManager em) {
        ActionParameters actionParameters = new ActionParameters()
            .parameterName(DEFAULT_PARAMETER_NAME)
            .displayNameDe(DEFAULT_DISPLAY_NAME_DE)
            .displayNameEn(DEFAULT_DISPLAY_NAME_EN)
            .displayNameFr(DEFAULT_DISPLAY_NAME_FR)
            .displayNameIt(DEFAULT_DISPLAY_NAME_IT);
        return actionParameters;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActionParameters createUpdatedEntity(EntityManager em) {
        ActionParameters actionParameters = new ActionParameters()
            .parameterName(UPDATED_PARAMETER_NAME)
            .displayNameDe(UPDATED_DISPLAY_NAME_DE)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR)
            .displayNameIt(UPDATED_DISPLAY_NAME_IT);
        return actionParameters;
    }

    @BeforeEach
    public void initTest() {
        actionParameters = createEntity(em);
    }

    @Test
    @Transactional
    void createActionParameters() throws Exception {
        int databaseSizeBeforeCreate = actionParametersRepository.findAll().size();
        // Create the ActionParameters
        restActionParametersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actionParameters))
            )
            .andExpect(status().isCreated());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeCreate + 1);
        ActionParameters testActionParameters = actionParametersList.get(actionParametersList.size() - 1);
        assertThat(testActionParameters.getParameterName()).isEqualTo(DEFAULT_PARAMETER_NAME);
        assertThat(testActionParameters.getDisplayNameDe()).isEqualTo(DEFAULT_DISPLAY_NAME_DE);
        assertThat(testActionParameters.getDisplayNameEn()).isEqualTo(DEFAULT_DISPLAY_NAME_EN);
        assertThat(testActionParameters.getDisplayNameFr()).isEqualTo(DEFAULT_DISPLAY_NAME_FR);
        assertThat(testActionParameters.getDisplayNameIt()).isEqualTo(DEFAULT_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void createActionParametersWithExistingId() throws Exception {
        // Create the ActionParameters with an existing ID
        actionParameters.setId(1L);

        int databaseSizeBeforeCreate = actionParametersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActionParametersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actionParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllActionParameters() throws Exception {
        // Initialize the database
        actionParametersRepository.saveAndFlush(actionParameters);

        // Get all the actionParametersList
        restActionParametersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actionParameters.getId().intValue())))
            .andExpect(jsonPath("$.[*].parameterName").value(hasItem(DEFAULT_PARAMETER_NAME)))
            .andExpect(jsonPath("$.[*].displayNameDe").value(hasItem(DEFAULT_DISPLAY_NAME_DE)))
            .andExpect(jsonPath("$.[*].displayNameEn").value(hasItem(DEFAULT_DISPLAY_NAME_EN)))
            .andExpect(jsonPath("$.[*].displayNameFr").value(hasItem(DEFAULT_DISPLAY_NAME_FR)))
            .andExpect(jsonPath("$.[*].displayNameIt").value(hasItem(DEFAULT_DISPLAY_NAME_IT)));
    }

    @Test
    @Transactional
    void getActionParameters() throws Exception {
        // Initialize the database
        actionParametersRepository.saveAndFlush(actionParameters);

        // Get the actionParameters
        restActionParametersMockMvc
            .perform(get(ENTITY_API_URL_ID, actionParameters.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(actionParameters.getId().intValue()))
            .andExpect(jsonPath("$.parameterName").value(DEFAULT_PARAMETER_NAME))
            .andExpect(jsonPath("$.displayNameDe").value(DEFAULT_DISPLAY_NAME_DE))
            .andExpect(jsonPath("$.displayNameEn").value(DEFAULT_DISPLAY_NAME_EN))
            .andExpect(jsonPath("$.displayNameFr").value(DEFAULT_DISPLAY_NAME_FR))
            .andExpect(jsonPath("$.displayNameIt").value(DEFAULT_DISPLAY_NAME_IT));
    }

    @Test
    @Transactional
    void getNonExistingActionParameters() throws Exception {
        // Get the actionParameters
        restActionParametersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActionParameters() throws Exception {
        // Initialize the database
        actionParametersRepository.saveAndFlush(actionParameters);

        int databaseSizeBeforeUpdate = actionParametersRepository.findAll().size();

        // Update the actionParameters
        ActionParameters updatedActionParameters = actionParametersRepository.findById(actionParameters.getId()).get();
        // Disconnect from session so that the updates on updatedActionParameters are not directly saved in db
        em.detach(updatedActionParameters);
        updatedActionParameters
            .parameterName(UPDATED_PARAMETER_NAME)
            .displayNameDe(UPDATED_DISPLAY_NAME_DE)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR)
            .displayNameIt(UPDATED_DISPLAY_NAME_IT);

        restActionParametersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActionParameters.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActionParameters))
            )
            .andExpect(status().isOk());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeUpdate);
        ActionParameters testActionParameters = actionParametersList.get(actionParametersList.size() - 1);
        assertThat(testActionParameters.getParameterName()).isEqualTo(UPDATED_PARAMETER_NAME);
        assertThat(testActionParameters.getDisplayNameDe()).isEqualTo(UPDATED_DISPLAY_NAME_DE);
        assertThat(testActionParameters.getDisplayNameEn()).isEqualTo(UPDATED_DISPLAY_NAME_EN);
        assertThat(testActionParameters.getDisplayNameFr()).isEqualTo(UPDATED_DISPLAY_NAME_FR);
        assertThat(testActionParameters.getDisplayNameIt()).isEqualTo(UPDATED_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void putNonExistingActionParameters() throws Exception {
        int databaseSizeBeforeUpdate = actionParametersRepository.findAll().size();
        actionParameters.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionParametersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, actionParameters.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActionParameters() throws Exception {
        int databaseSizeBeforeUpdate = actionParametersRepository.findAll().size();
        actionParameters.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParametersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actionParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActionParameters() throws Exception {
        int databaseSizeBeforeUpdate = actionParametersRepository.findAll().size();
        actionParameters.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParametersMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actionParameters))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActionParametersWithPatch() throws Exception {
        // Initialize the database
        actionParametersRepository.saveAndFlush(actionParameters);

        int databaseSizeBeforeUpdate = actionParametersRepository.findAll().size();

        // Update the actionParameters using partial update
        ActionParameters partialUpdatedActionParameters = new ActionParameters();
        partialUpdatedActionParameters.setId(actionParameters.getId());

        restActionParametersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActionParameters.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActionParameters))
            )
            .andExpect(status().isOk());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeUpdate);
        ActionParameters testActionParameters = actionParametersList.get(actionParametersList.size() - 1);
        assertThat(testActionParameters.getParameterName()).isEqualTo(DEFAULT_PARAMETER_NAME);
        assertThat(testActionParameters.getDisplayNameDe()).isEqualTo(DEFAULT_DISPLAY_NAME_DE);
        assertThat(testActionParameters.getDisplayNameEn()).isEqualTo(DEFAULT_DISPLAY_NAME_EN);
        assertThat(testActionParameters.getDisplayNameFr()).isEqualTo(DEFAULT_DISPLAY_NAME_FR);
        assertThat(testActionParameters.getDisplayNameIt()).isEqualTo(DEFAULT_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void fullUpdateActionParametersWithPatch() throws Exception {
        // Initialize the database
        actionParametersRepository.saveAndFlush(actionParameters);

        int databaseSizeBeforeUpdate = actionParametersRepository.findAll().size();

        // Update the actionParameters using partial update
        ActionParameters partialUpdatedActionParameters = new ActionParameters();
        partialUpdatedActionParameters.setId(actionParameters.getId());

        partialUpdatedActionParameters
            .parameterName(UPDATED_PARAMETER_NAME)
            .displayNameDe(UPDATED_DISPLAY_NAME_DE)
            .displayNameEn(UPDATED_DISPLAY_NAME_EN)
            .displayNameFr(UPDATED_DISPLAY_NAME_FR)
            .displayNameIt(UPDATED_DISPLAY_NAME_IT);

        restActionParametersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActionParameters.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActionParameters))
            )
            .andExpect(status().isOk());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeUpdate);
        ActionParameters testActionParameters = actionParametersList.get(actionParametersList.size() - 1);
        assertThat(testActionParameters.getParameterName()).isEqualTo(UPDATED_PARAMETER_NAME);
        assertThat(testActionParameters.getDisplayNameDe()).isEqualTo(UPDATED_DISPLAY_NAME_DE);
        assertThat(testActionParameters.getDisplayNameEn()).isEqualTo(UPDATED_DISPLAY_NAME_EN);
        assertThat(testActionParameters.getDisplayNameFr()).isEqualTo(UPDATED_DISPLAY_NAME_FR);
        assertThat(testActionParameters.getDisplayNameIt()).isEqualTo(UPDATED_DISPLAY_NAME_IT);
    }

    @Test
    @Transactional
    void patchNonExistingActionParameters() throws Exception {
        int databaseSizeBeforeUpdate = actionParametersRepository.findAll().size();
        actionParameters.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActionParametersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, actionParameters.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActionParameters() throws Exception {
        int databaseSizeBeforeUpdate = actionParametersRepository.findAll().size();
        actionParameters.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParametersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActionParameters() throws Exception {
        int databaseSizeBeforeUpdate = actionParametersRepository.findAll().size();
        actionParameters.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActionParametersMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actionParameters))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActionParameters in the database
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActionParameters() throws Exception {
        // Initialize the database
        actionParametersRepository.saveAndFlush(actionParameters);

        int databaseSizeBeforeDelete = actionParametersRepository.findAll().size();

        // Delete the actionParameters
        restActionParametersMockMvc
            .perform(delete(ENTITY_API_URL_ID, actionParameters.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActionParameters> actionParametersList = actionParametersRepository.findAll();
        assertThat(actionParametersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
