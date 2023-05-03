package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.CriteriaDefinition;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "criteria_definition")
    private CriteriaDefinition criteriaDefinition;

    @OneToMany(mappedBy = "criteria")
    @JsonIgnoreProperties(value = { "criteria" }, allowSetters = true)
    private Set<CriteriaParameter> criteriaParameters = new HashSet<>();

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

    public CriteriaDefinition getCriteriaDefinition() {
        return this.criteriaDefinition;
    }

    public Criteria criteriaDefinition(CriteriaDefinition criteriaDefinition) {
        this.setCriteriaDefinition(criteriaDefinition);
        return this;
    }

    public void setCriteriaDefinition(CriteriaDefinition criteriaDefinition) {
        this.criteriaDefinition = criteriaDefinition;
    }

    public Set<CriteriaParameter> getCriteriaParameters() {
        return this.criteriaParameters;
    }

    public void setCriteriaParameters(Set<CriteriaParameter> criteriaParameters) {
        if (this.criteriaParameters != null) {
            this.criteriaParameters.forEach(i -> i.setCriteria(null));
        }
        if (criteriaParameters != null) {
            criteriaParameters.forEach(i -> i.setCriteria(this));
        }
        this.criteriaParameters = criteriaParameters;
    }

    public Criteria criteriaParameters(Set<CriteriaParameter> criteriaParameters) {
        this.setCriteriaParameters(criteriaParameters);
        return this;
    }

    public Criteria addCriteriaParameters(CriteriaParameter criteriaParameter) {
        this.criteriaParameters.add(criteriaParameter);
        criteriaParameter.setCriteria(this);
        return this;
    }

    public Criteria removeCriteriaParameters(CriteriaParameter criteriaParameter) {
        this.criteriaParameters.remove(criteriaParameter);
        criteriaParameter.setCriteria(null);
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
            ", criteriaDefinition='" + getCriteriaDefinition() + "'" +
            "}";
    }
}
