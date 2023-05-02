package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A ParameterValue.
 */
@Entity
@Table(name = "parameter_value")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ParameterValue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "action_parameter_value")
    private String actionParameterValue;

    @ManyToOne
    private Parameter actionParameter;

    @ManyToOne
    @JsonIgnoreProperties(value = { "criteriaParameters", "property", "criteriaSet" }, allowSetters = true)
    private Criteria criteria;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ParameterValue id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActionParameterValue() {
        return this.actionParameterValue;
    }

    public ParameterValue actionParameterValue(String actionParameterValue) {
        this.setActionParameterValue(actionParameterValue);
        return this;
    }

    public void setActionParameterValue(String actionParameterValue) {
        this.actionParameterValue = actionParameterValue;
    }

    public Parameter getActionParameter() {
        return this.actionParameter;
    }

    public void setActionParameter(Parameter parameter) {
        this.actionParameter = parameter;
    }

    public ParameterValue actionParameter(Parameter parameter) {
        this.setActionParameter(parameter);
        return this;
    }

    public Criteria getCriteria() {
        return this.criteria;
    }

    public void setCriteria(Criteria criteria) {
        this.criteria = criteria;
    }

    public ParameterValue criteria(Criteria criteria) {
        this.setCriteria(criteria);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ParameterValue)) {
            return false;
        }
        return id != null && id.equals(((ParameterValue) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ParameterValue{" +
            "id=" + getId() +
            ", actionParameterValue='" + getActionParameterValue() + "'" +
            "}";
    }
}
