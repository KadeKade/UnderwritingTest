package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
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

    @OneToMany(mappedBy = "criteriaSet")
    @JsonIgnoreProperties(value = { "property", "criteriaSet" }, allowSetters = true)
    private Set<Criteria> criterias = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "positiveActionParameters" }, allowSetters = true)
    private AutomatedAction automatedAction;

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

    public Set<Criteria> getCriterias() {
        return this.criterias;
    }

    public void setCriterias(Set<Criteria> criteria) {
        if (this.criterias != null) {
            this.criterias.forEach(i -> i.setCriteriaSet(null));
        }
        if (criteria != null) {
            criteria.forEach(i -> i.setCriteriaSet(this));
        }
        this.criterias = criteria;
    }

    public CriteriaSet criterias(Set<Criteria> criteria) {
        this.setCriterias(criteria);
        return this;
    }

    public CriteriaSet addCriterias(Criteria criteria) {
        this.criterias.add(criteria);
        criteria.setCriteriaSet(this);
        return this;
    }

    public CriteriaSet removeCriterias(Criteria criteria) {
        this.criterias.remove(criteria);
        criteria.setCriteriaSet(null);
        return this;
    }

    public AutomatedAction getAutomatedAction() {
        return this.automatedAction;
    }

    public void setAutomatedAction(AutomatedAction automatedAction) {
        this.automatedAction = automatedAction;
    }

    public CriteriaSet automatedAction(AutomatedAction automatedAction) {
        this.setAutomatedAction(automatedAction);
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
