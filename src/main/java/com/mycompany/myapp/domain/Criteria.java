package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.CriteriaType;
import com.mycompany.myapp.domain.enumeration.Operator;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Criteria.
 */
@Entity
@Table(name = "criteria")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Criteria implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "criteria_action_type")
    private CriteriaType criteriaActionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "operator")
    private Operator operator;

    @Column(name = "criteria_property_value")
    private String criteriaPropertyValue;

    @Column(name = "positive_action_property_value")
    private String positiveActionPropertyValue;

    @OneToMany(mappedBy = "criteria")
    @JsonIgnoreProperties(value = { "actionParameter", "criteria" }, allowSetters = true)
    private Set<ParameterValue> criteriaParameters = new HashSet<>();

    @ManyToOne
    private CriteriaProperty property;

    @ManyToOne
    @JsonIgnoreProperties(value = { "criterias", "automatedAction" }, allowSetters = true)
    private CriteriaSet criteriaSet;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Criteria id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CriteriaType getCriteriaActionType() {
        return this.criteriaActionType;
    }

    public Criteria criteriaActionType(CriteriaType criteriaActionType) {
        this.setCriteriaActionType(criteriaActionType);
        return this;
    }

    public void setCriteriaActionType(CriteriaType criteriaActionType) {
        this.criteriaActionType = criteriaActionType;
    }

    public Operator getOperator() {
        return this.operator;
    }

    public Criteria operator(Operator operator) {
        this.setOperator(operator);
        return this;
    }

    public void setOperator(Operator operator) {
        this.operator = operator;
    }

    public String getCriteriaPropertyValue() {
        return this.criteriaPropertyValue;
    }

    public Criteria criteriaPropertyValue(String criteriaPropertyValue) {
        this.setCriteriaPropertyValue(criteriaPropertyValue);
        return this;
    }

    public void setCriteriaPropertyValue(String criteriaPropertyValue) {
        this.criteriaPropertyValue = criteriaPropertyValue;
    }

    public String getPositiveActionPropertyValue() {
        return this.positiveActionPropertyValue;
    }

    public Criteria positiveActionPropertyValue(String positiveActionPropertyValue) {
        this.setPositiveActionPropertyValue(positiveActionPropertyValue);
        return this;
    }

    public void setPositiveActionPropertyValue(String positiveActionPropertyValue) {
        this.positiveActionPropertyValue = positiveActionPropertyValue;
    }

    public Set<ParameterValue> getCriteriaParameters() {
        return this.criteriaParameters;
    }

    public void setCriteriaParameters(Set<ParameterValue> parameterValues) {
        if (this.criteriaParameters != null) {
            this.criteriaParameters.forEach(i -> i.setCriteria(null));
        }
        if (parameterValues != null) {
            parameterValues.forEach(i -> i.setCriteria(this));
        }
        this.criteriaParameters = parameterValues;
    }

    public Criteria criteriaParameters(Set<ParameterValue> parameterValues) {
        this.setCriteriaParameters(parameterValues);
        return this;
    }

    public Criteria addCriteriaParameters(ParameterValue parameterValue) {
        this.criteriaParameters.add(parameterValue);
        parameterValue.setCriteria(this);
        return this;
    }

    public Criteria removeCriteriaParameters(ParameterValue parameterValue) {
        this.criteriaParameters.remove(parameterValue);
        parameterValue.setCriteria(null);
        return this;
    }

    public CriteriaProperty getProperty() {
        return this.property;
    }

    public void setProperty(CriteriaProperty criteriaProperty) {
        this.property = criteriaProperty;
    }

    public Criteria property(CriteriaProperty criteriaProperty) {
        this.setProperty(criteriaProperty);
        return this;
    }

    public CriteriaSet getCriteriaSet() {
        return this.criteriaSet;
    }

    public void setCriteriaSet(CriteriaSet criteriaSet) {
        this.criteriaSet = criteriaSet;
    }

    public Criteria criteriaSet(CriteriaSet criteriaSet) {
        this.setCriteriaSet(criteriaSet);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Criteria)) {
            return false;
        }
        return id != null && id.equals(((Criteria) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Criteria{" +
            "id=" + getId() +
            ", criteriaActionType='" + getCriteriaActionType() + "'" +
            ", operator='" + getOperator() + "'" +
            ", criteriaPropertyValue='" + getCriteriaPropertyValue() + "'" +
            ", positiveActionPropertyValue='" + getPositiveActionPropertyValue() + "'" +
            "}";
    }
}
