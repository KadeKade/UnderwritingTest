import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBrokerCategory, NewBrokerCategory } from '../broker-category.model';

export type PartialUpdateBrokerCategory = Partial<IBrokerCategory> & Pick<IBrokerCategory, 'id'>;

export type EntityResponseType = HttpResponse<IBrokerCategory>;
export type EntityArrayResponseType = HttpResponse<IBrokerCategory[]>;

@Injectable({ providedIn: 'root' })
export class BrokerCategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/broker-categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(brokerCategory: NewBrokerCategory): Observable<EntityResponseType> {
    return this.http.post<IBrokerCategory>(this.resourceUrl, brokerCategory, { observe: 'response' });
  }

  update(brokerCategory: IBrokerCategory): Observable<EntityResponseType> {
    return this.http.put<IBrokerCategory>(`${this.resourceUrl}/${this.getBrokerCategoryIdentifier(brokerCategory)}`, brokerCategory, {
      observe: 'response',
    });
  }

  partialUpdate(brokerCategory: PartialUpdateBrokerCategory): Observable<EntityResponseType> {
    return this.http.patch<IBrokerCategory>(`${this.resourceUrl}/${this.getBrokerCategoryIdentifier(brokerCategory)}`, brokerCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBrokerCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBrokerCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBrokerCategoryIdentifier(brokerCategory: Pick<IBrokerCategory, 'id'>): number {
    return brokerCategory.id;
  }

  compareBrokerCategory(o1: Pick<IBrokerCategory, 'id'> | null, o2: Pick<IBrokerCategory, 'id'> | null): boolean {
    return o1 && o2 ? this.getBrokerCategoryIdentifier(o1) === this.getBrokerCategoryIdentifier(o2) : o1 === o2;
  }

  addBrokerCategoryToCollectionIfMissing<Type extends Pick<IBrokerCategory, 'id'>>(
    brokerCategoryCollection: Type[],
    ...brokerCategoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const brokerCategories: Type[] = brokerCategoriesToCheck.filter(isPresent);
    if (brokerCategories.length > 0) {
      const brokerCategoryCollectionIdentifiers = brokerCategoryCollection.map(
        brokerCategoryItem => this.getBrokerCategoryIdentifier(brokerCategoryItem)!
      );
      const brokerCategoriesToAdd = brokerCategories.filter(brokerCategoryItem => {
        const brokerCategoryIdentifier = this.getBrokerCategoryIdentifier(brokerCategoryItem);
        if (brokerCategoryCollectionIdentifiers.includes(brokerCategoryIdentifier)) {
          return false;
        }
        brokerCategoryCollectionIdentifiers.push(brokerCategoryIdentifier);
        return true;
      });
      return [...brokerCategoriesToAdd, ...brokerCategoryCollection];
    }
    return brokerCategoryCollection;
  }
}
