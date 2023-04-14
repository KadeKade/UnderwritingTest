package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A ActionParameterValues.
 */
@Entity
@Table(name = "action_parameter_values")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ActionParameterValues implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "parameter_value")
    private String parameterValue;

    @ManyToOne
    @JsonIgnoreProperties(value = { "action" }, allowSetters = true)
    private ActionParameters parameter;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActionParameterValues id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getParameterValue() {
        return this.parameterValue;
    }

    public ActionParameterValues parameterValue(String parameterValue) {
        this.setParameterValue(parameterValue);
        return this;
    }

    public void setParameterValue(String parameterValue) {
        this.parameterValue = parameterValue;
    }

    public ActionParameters getParameter() {
        return this.parameter;
    }

    public void setParameter(ActionParameters actionParameters) {
        this.parameter = actionParameters;
    }

    public ActionParameterValues parameter(ActionParameters actionParameters) {
        this.setParameter(actionParameters);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActionParameterValues)) {
            return false;
        }
        return id != null && id.equals(((ActionParameterValues) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActionParameterValues{" +
            "id=" + getId() +
            ", parameterValue='" + getParameterValue() + "'" +
            "}";
    }
}
