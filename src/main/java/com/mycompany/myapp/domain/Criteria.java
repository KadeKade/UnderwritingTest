package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @Column(name = "operator")
    private Operator operator;

    @Column(name = "property_value")
    private String propertyValue;

    @ManyToOne
    private CriteriaPropery property;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "positiveAction", "positiveActionParameters", "negativeAction", "negativeActionParameters" },
        allowSetters = true
    )
    private CriteriaSet criteria;

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

    public String getPropertyValue() {
        return this.propertyValue;
    }

    public Criteria propertyValue(String propertyValue) {
        this.setPropertyValue(propertyValue);
        return this;
    }

    public void setPropertyValue(String propertyValue) {
        this.propertyValue = propertyValue;
    }

    public CriteriaPropery getProperty() {
        return this.property;
    }

    public void setProperty(CriteriaPropery criteriaPropery) {
        this.property = criteriaPropery;
    }

    public Criteria property(CriteriaPropery criteriaPropery) {
        this.setProperty(criteriaPropery);
        return this;
    }

    public CriteriaSet getCriteria() {
        return this.criteria;
    }

    public void setCriteria(CriteriaSet criteriaSet) {
        this.criteria = criteriaSet;
    }

    public Criteria criteria(CriteriaSet criteriaSet) {
        this.setCriteria(criteriaSet);
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
            ", operator='" + getOperator() + "'" +
            ", propertyValue='" + getPropertyValue() + "'" +
            "}";
    }
}
