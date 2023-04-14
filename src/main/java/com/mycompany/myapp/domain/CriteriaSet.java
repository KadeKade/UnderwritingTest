package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A CriteriaSet.
 */
@Entity
@Table(name = "criteria_set")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CriteriaSet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "insurer_id")
    private Long insurerId;

    @Column(name = "lob_id")
    private Long lobId;

    @ManyToOne
    private Action positiveAction;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameter" }, allowSetters = true)
    private ActionParameterValues positiveActionParameters;

    @ManyToOne
    private Action negativeAction;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameter" }, allowSetters = true)
    private ActionParameterValues negativeActionParameters;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CriteriaSet id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public CriteriaSet name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getInsurerId() {
        return this.insurerId;
    }

    public CriteriaSet insurerId(Long insurerId) {
        this.setInsurerId(insurerId);
        return this;
    }

    public void setInsurerId(Long insurerId) {
        this.insurerId = insurerId;
    }

    public Long getLobId() {
        return this.lobId;
    }

    public CriteriaSet lobId(Long lobId) {
        this.setLobId(lobId);
        return this;
    }

    public void setLobId(Long lobId) {
        this.lobId = lobId;
    }

    public Action getPositiveAction() {
        return this.positiveAction;
    }

    public void setPositiveAction(Action action) {
        this.positiveAction = action;
    }

    public CriteriaSet positiveAction(Action action) {
        this.setPositiveAction(action);
        return this;
    }

    public ActionParameterValues getPositiveActionParameters() {
        return this.positiveActionParameters;
    }

    public void setPositiveActionParameters(ActionParameterValues actionParameterValues) {
        this.positiveActionParameters = actionParameterValues;
    }

    public CriteriaSet positiveActionParameters(ActionParameterValues actionParameterValues) {
        this.setPositiveActionParameters(actionParameterValues);
        return this;
    }

    public Action getNegativeAction() {
        return this.negativeAction;
    }

    public void setNegativeAction(Action action) {
        this.negativeAction = action;
    }

    public CriteriaSet negativeAction(Action action) {
        this.setNegativeAction(action);
        return this;
    }

    public ActionParameterValues getNegativeActionParameters() {
        return this.negativeActionParameters;
    }

    public void setNegativeActionParameters(ActionParameterValues actionParameterValues) {
        this.negativeActionParameters = actionParameterValues;
    }

    public CriteriaSet negativeActionParameters(ActionParameterValues actionParameterValues) {
        this.setNegativeActionParameters(actionParameterValues);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CriteriaSet)) {
            return false;
        }
        return id != null && id.equals(((CriteriaSet) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CriteriaSet{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", insurerId=" + getInsurerId() +
            ", lobId=" + getLobId() +
            "}";
    }
}
