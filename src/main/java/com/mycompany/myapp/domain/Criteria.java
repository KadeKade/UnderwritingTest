package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.CriteriaType;
import com.mycompany.myapp.domain.enumeration.Operator;
import java.io.Serializable;
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
    @Column(name = "criteria_type")
    private CriteriaType criteriaType;

    @Enumerated(EnumType.STRING)
    @Column(name = "operator")
    private Operator operator;

    @Column(name = "criteria_property_value")
    private String criteriaPropertyValue;

    @Column(name = "positive_action_property_value")
    private String positiveActionPropertyValue;

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

    public CriteriaType getCriteriaType() {
        return this.criteriaType;
    }

    public Criteria criteriaType(CriteriaType criteriaType) {
        this.setCriteriaType(criteriaType);
        return this;
    }

    public void setCriteriaType(CriteriaType criteriaType) {
        this.criteriaType = criteriaType;
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
            ", criteriaType='" + getCriteriaType() + "'" +
            ", operator='" + getOperator() + "'" +
            ", criteriaPropertyValue='" + getCriteriaPropertyValue() + "'" +
            ", positiveActionPropertyValue='" + getPositiveActionPropertyValue() + "'" +
            "}";
    }
}
